import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { configId, contentId } = data;

    if (!configId || !contentId) {
      return NextResponse.json(
        { error: 'Missing configId or contentId' },
        { status: 400 }
      );
    }

    // Mock generated content - simulates AI generation
    const mockGeneratedContent = {
      id: contentId,
      configId,
      generatedContents: {
        blog: {
          id: `${contentId}_blog`,
          format: 'blog',
          title: 'Complete Guide to Marketing Automation',
          content: `# Complete Guide to Marketing Automation

In today's digital landscape, marketing automation tools have become essential...

## What is Marketing Automation?

Marketing automation refers to software platforms that enable organizations to...

## Key Benefits

1. **Time Efficiency** - Automate repetitive tasks
2. **Lead Nurturing** - Personalized customer journeys
3. **Analytics** - Data-driven decision making

## Best Practices

- Start with clear goals
- Segment your audience
- Test and iterate
- Monitor performance metrics

## Conclusion

Marketing automation is transforming how businesses engage with customers...`,
          estimatedReadTime: '8 min read',
          seoKeywords: ['marketing automation', 'customer journey mapping'],
          generatedAt: new Date().toISOString(),
        },
        email: {
          id: `${contentId}_email`,
          format: 'email',
          subject: 'Introducing: Your Marketing Automation Solution',
          previewText: 'Streamline your marketing with automation',
          body: `Dear [Name],

We're excited to introduce our new marketing automation platform designed specifically for teams like yours.

**Why Choose Our Platform?**
- Save 20+ hours per week on manual tasks
- Increase lead conversion by 35%
- Gain deep insights into customer behavior

**Get Started Today**
[Click here to see a demo](https://example.com)

Best regards,
The Team`,
          cta: 'View Demo',
          generatedAt: new Date().toISOString(),
        },
        social_linkedin: {
          id: `${contentId}_linkedin`,
          format: 'social_linkedin',
          content: `🚀 Did you know? Marketing automation can increase productivity by 40%.

Here's why teams are switching:
✓ Automate repetitive tasks
✓ Better customer journey mapping
✓ Data-driven decisions

Ready to transform your marketing workflow? Let's talk! 💬`,
          hashtags: ['#MarketingAutomation', '#DigitalMarketing', '#Growth'],
          estimatedEngagement: 'High',
          generatedAt: new Date().toISOString(),
        },
      },
      metadata: {
        generationTime: '2.3s',
        model: 'Mock Generator',
        tokensUsed: 1250,
      },
    };

    return NextResponse.json(mockGeneratedContent);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
