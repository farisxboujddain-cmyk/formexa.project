const express = require('express');
const router = express.Router();
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const { authenticateJWT, requireSubscription } = require('../middleware/auth');
const { applyPlanLimiter } = require('../middleware/rateLimiter');
const User = require('../models/User');
const Project = require('../models/Project');

// Generate article
router.post(
  '/generate-article',
  authenticateJWT,
  applyPlanLimiter,
  [body('prompt').trim().notEmpty().isLength({ min: 10, max: 1000 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { prompt, title, saveProject } = req.body;
      const user = await User.findById(req.user.id);

      // Check subscription limits
      await user.resetMonthlyUsage();
      if (!user.canUseFeature('articles')) {
        return res.status(403).json({
          error: 'Article generation limit reached for this month',
          limits: user.getSubscriptionLimits(),
          current: user.usage
        });
      }

      // Call OpenAI API
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4',
            messages: [
              {
                role: 'user',
                content: `Write a detailed article about: ${prompt}`
              }
            ],
            max_tokens: 2000,
            temperature: 0.7
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const content = response.data.choices[0]?.message?.content || '';

        // Increment usage
        await user.incrementUsage('articles');

        // Optionally save project
        if (saveProject) {
          const project = new Project({
            userId: user._id,
            title: title || `Article - ${new Date().toLocaleDateString()}`,
            type: 'article',
            content: {
              input: prompt,
              output: content
            },
            aiProvider: 'openai'
          });
          await project.save();
        }

        res.json({
          content,
          usage: user.usage,
          limits: user.getSubscriptionLimits(),
          projectId: saveProject ? new Project()._id : null,
          tokensUsed: response.data.usage?.total_tokens || 0
        });
      } catch (apiError) {
        console.error('OpenAI API error:', apiError.response?.data || apiError.message);
        res.status(500).json({ error: 'Failed to generate article' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Generate image
router.post(
  '/generate-image',
  authenticateJWT,
  applyPlanLimiter,
  [body('prompt').trim().notEmpty().isLength({ min: 5, max: 1000 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { prompt, size, saveProject } = req.body;
      const user = await User.findById(req.user.id);

      await user.resetMonthlyUsage();
      if (!user.canUseFeature('images')) {
        return res.status(403).json({
          error: 'Image generation limit reached for this month',
          limits: user.getSubscriptionLimits(),
          current: user.usage
        });
      }

      try {
        const response = await axios.post(
          'https://api.openai.com/v1/images/generations',
          {
            model: 'dall-e-3',
            prompt,
            n: 1,
            size: size || '1024x1024',
            quality: user.subscriptionPlan === 'business' ? 'hd' : 'standard',
            response_format: 'url'
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const imageUrl = response.data.data[0]?.url || '';
        await user.incrementUsage('images');

        if (saveProject) {
          const project = new Project({
            userId: user._id,
            title: `Image - ${new Date().toLocaleDateString()}`,
            type: 'image',
            content: {
              input: prompt,
              output: imageUrl
            },
            aiProvider: 'openai'
          });
          await project.save();
        }

        res.json({
          imageUrl,
          usage: user.usage,
          limits: user.getSubscriptionLimits()
        });
      } catch (apiError) {
        console.error('DALL-E API error:', apiError.response?.data || apiError.message);
        res.status(500).json({ error: 'Failed to generate image' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Generate code
router.post(
  '/generate-code',
  authenticateJWT,
  applyPlanLimiter,
  [body('prompt').trim().notEmpty().isLength({ min: 5, max: 1000 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { prompt, language, saveProject } = req.body;
      const user = await User.findById(req.user.id);

      await user.resetMonthlyUsage();
      if (!user.canUseFeature('code')) {
        return res.status(403).json({
          error: 'Code generation limit reached for this month',
          limits: user.getSubscriptionLimits(),
          current: user.usage
        });
      }

      // Use Gemini for code generation (or GPT-4)
      const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
      const provider = apiKey ? 'gemini' : 'openai';

      let code = '';
      if (provider === 'gemini') {
        try {
          const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
              contents: [
                {
                  parts: [
                    {
                      text: `Generate ${language || 'JavaScript'} code for: ${prompt}`
                    }
                  ]
                }
              ]
            }
          );
          code = response.data.candidates[0]?.content?.parts[0]?.text || '';
        } catch (apiError) {
          console.error('Gemini API error:', apiError.response?.data || apiError.message);
          code = '// Code generation failed';
        }
      } else {
        try {
          const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: 'gpt-4',
              messages: [
                {
                  role: 'user',
                  content: `Generate ${language || 'JavaScript'} code for: ${prompt}`
                }
              ],
              max_tokens: 2000,
              temperature: 0.5
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );
          code = response.data.choices[0]?.message?.content || '';
        } catch (apiError) {
          console.error('OpenAI API error:', apiError.response?.data || apiError.message);
          code = '// Code generation failed';
        }
      }

      await user.incrementUsage('code');

      if (saveProject) {
        const project = new Project({
          userId: user._id,
          title: `Code - ${new Date().toLocaleDateString()}`,
          type: 'code',
          content: {
            input: prompt,
            output: code
          },
          aiProvider: provider
        });
        await project.save();
      }

      res.json({
        code,
        language: language || 'javascript',
        provider,
        usage: user.usage,
        limits: user.getSubscriptionLimits()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
