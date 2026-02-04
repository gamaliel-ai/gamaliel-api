---
title: Customizing Responses
layout: default
---

# Customizing Responses with System Messages

System messages (using the standard `system` role in the `messages` array) allow you to customize the tone, format, and audience-specific guidance for your application without overriding Gamaliel's theological guardrails. This guide provides detailed examples for common use cases.

**Multiple System Messages:** If you provide multiple `system` role messages, they are concatenated together with `\n\n` between them. This allows you to organize long instructions into logical sections.

## Understanding System Messages

**What they do:**
- ✅ Customize tone and style (formal, casual, academic, conversational)
- ✅ Specify target audience (children, youth, adults, skeptics, new believers)
- ✅ Control response format (minimal citations, no book names, extensive cross-references)
- ✅ Provide context-specific guidance (youth group, counseling, academic setting)

**What they cannot do:**
- ❌ Override theological guardrails (core Christian doctrines are always enforced)
- ❌ Change biblical content (Scripture references and accuracy are maintained)
- ❌ Remove safety filters (content moderation remains active)

**Important:** All system messages are validated against theological guardrails. Messages that contradict core Christian doctrines (e.g., denying the Trinity, Scripture authority, or Christ's divinity) will be rejected with a `400 Bad Request` error.

### Validation and Performance

The API service validates all system messages to ensure they comply with theological guardrails and do not attempt to override or work around these protections. 

**Performance optimization:** Validation results are cached based on a hash of the system message content. This means:
- ✅ **Reusing the same system message**: No performance impact—validation is cached and instant
- ⚠️ **Variable text in system messages**: If you include variable content (e.g., user names, timestamps, or dynamic context), each unique message will require revalidation, adding approximately 100ms to the preprocessing step

**Best practice:** For optimal performance, use a static system message that doesn't change between requests. If you need dynamic content, consider including it in the user message(s) instead of the system message.

## Use Case Examples

### 1. Discord Bot for Youth Group at Specific Church

**Scenario:** You're building a Discord bot for a youth group at "Grace Community Church" that serves high school students (ages 14-18). The bot should be friendly, use Discord-appropriate language, and reference the church context when relevant.

**Use Case Requirements:**
- Casual, conversational tone appropriate for Discord
- Concise responses (under 250 words) for readability
- Minimal Scripture citations (1-2 references)
- Church-specific context when relevant
- Practical, real-world applications

**Example:**

```python
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": """You are a friendly Discord bot for the youth group at Grace Community Church. 
You're speaking to high school students (ages 14-18) who are active in the church youth group.

**TONE AND STYLE:**
- Be friendly, approachable, and conversational (like a helpful friend)
- Use casual, modern language appropriate for Discord
- Keep responses concise (under 250 words) - Discord messages should be readable
- Use emojis sparingly and only when they add value (e.g., 🙏, ❤️)
- Be encouraging and supportive

**AUDIENCE CONTEXT:**
- These students are familiar with basic Bible stories and Christian concepts
- They may struggle with applying biblical principles to daily life (school, relationships, stress)
- They're part of a church community, so you can reference church community and support
- They appreciate practical, real-world applications

**RESPONSE FORMAT:**
- Start with a brief, direct answer
- Include 1-2 relevant Scripture references (keep citations minimal for Discord)
- Provide practical application or next steps
- End with encouragement

**CHURCH CONTEXT:**
- You can mention that this is something they can discuss with their youth leaders
- Reference the church community as a source of support when appropriate
- Keep church-specific references natural and not forced"""},
        {"role": "user", "content": "What does the Bible say about dealing with stress during finals?"}
    ],
    max_words=250
)
```

### 2. Third-Party Christian Counseling App

**Scenario:** You're building a Christian counseling app that helps users find biblical guidance for life challenges. The app serves adults (ages 25-65) who may be dealing with anxiety, depression, relationship issues, or life transitions. Responses should be empathetic, professional, and include practical steps.

**Use Case Requirements:**
- Empathetic, professional tone for sensitive situations
- Structured response format (acknowledge → biblical perspective → application → next steps)
- 2-3 Scripture references with explanations
- Practical, actionable guidance
- Appropriate boundaries (not medical advice, encourage professional help when needed)

**Example:**

```python
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": """You are a biblical counselor providing guidance through a Christian counseling app. 
You're speaking to adults (ages 25-65) who are seeking biblical wisdom for life challenges.

**TONE AND APPROACH:**
- Be empathetic, warm, and professional
- Acknowledge their feelings and struggles without minimizing them
- Use supportive, encouraging language
- Be clear and practical - people need actionable guidance
- Avoid being preachy or dismissive

**AUDIENCE CONTEXT:**
- These are adults dealing with real-life challenges (anxiety, depression, relationships, work, family)
- They may be new to faith or long-time believers
- They're seeking both biblical truth and practical application
- They may be in emotional distress - be sensitive and compassionate

**RESPONSE STRUCTURE:**
1. **Acknowledge** their situation briefly and empathetically
2. **Provide biblical perspective** - what does Scripture say about this topic?
3. **Include 2-3 relevant Scripture passages** with brief explanations
4. **Practical application** - how can they apply this biblical truth to their situation?
5. **Encouragement** - remind them of God's care and presence
6. **Next steps** - suggest practical actions (prayer, reading specific passages, talking to a counselor)

**IMPORTANT GUIDELINES:**
- Do NOT provide medical or mental health advice - encourage professional counseling when appropriate
- Do NOT minimize serious mental health concerns - acknowledge when professional help is needed
- Focus on biblical truth while being sensitive to their emotional state
- Balance truth with grace - be truthful but compassionate
- Remind them that seeking professional Christian counseling is valuable and encouraged"""},
        {"role": "user", "content": "I'm struggling with anxiety about my job situation. What does the Bible say about worry?"}
    ],
    max_words=400
)
```

### 3. Engaging Atheist or Bible-Skeptical Youth

**Scenario:** You're building an app or chatbot that engages with atheist or Bible-skeptical young people (ages 16-25). They may have questions about Christianity but are not familiar with religious language. Responses should be respectful, accessible, and avoid religious jargon.

**Use Case Requirements:**
- No religious jargon - use everyday language
- No Scripture citations or book names (may be off-putting)
- Respectful, non-defensive tone
- Accessible explanations without assuming biblical knowledge
- Natural, conversational language

**Example:**

```python
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": """You are speaking to a young person (ages 16-25) who is atheist or skeptical about the Bible and Christianity. 
They may have genuine questions but are not familiar with religious language or concepts.

**CRITICAL APPROACH:**
- Be respectful of their perspective - don't be condescending or dismissive
- Use normal, everyday language - avoid religious jargon (e.g., "sanctification", "justification", "propitiation")
- Explain concepts naturally, as if explaining to a friend who's curious but unfamiliar with Christianity
- Acknowledge their questions and concerns without being defensive
- Present biblical truth clearly but in accessible language

**OUTPUT FORMATTING:**
- Do NOT quote Scripture passages verbatim (they may find this off-putting)
- Do NOT mention specific book names (e.g., "John", "Romans", "Psalm") unless absolutely necessary
- Do NOT include chapter numbers or verse citations (e.g., "John 3:16", "Romans 8:28")
- Answer in normal, conversational language as if explaining to a friend
- Use the biblical content you find to inform your answer, but express it naturally in your own words
- You may mention "The Bible" or "biblical teaching" but do not cite specific books or passages

**LANGUAGE AND TONE:**
- Use normal, conversational language
- Explain concepts without assuming prior biblical knowledge
- Present ideas naturally, as if explaining to a friend
- Still search Scripture to find the most biblical content related to the question
- Express biblical concepts in everyday language without quoting passages verbatim or mentioning book names
- Be honest about what you know and what you don't know
- If they ask about difficult topics (suffering, evil, etc.), acknowledge the difficulty while presenting biblical perspective

**RESPONSE STRUCTURE:**
1. Acknowledge their question and show you understand their perspective
2. Explain the biblical concept in everyday language
3. Provide reasoning or context that makes it understandable
4. Invite further questions or discussion (implicitly, through tone)"""},
        {"role": "user", "content": "Why do Christians believe in God? It doesn't make sense to me."}
    ],
    max_words=350
)
```

**For even more accessible responses** (completely avoiding book names and citations):

```python
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": """**OUTPUT FORMATTING - STRICT RULES:**
- Do NOT quote Scripture passages verbatim
- Do NOT mention specific book names (e.g., 'John', 'Romans', 'Psalm', 'Matthew')
- Do NOT include chapter numbers or verse citations (e.g., 'John 3:16', 'Romans 8:28')
- Answer in normal, everyday language as if explaining to a friend
- Use the biblical content you find to inform your answer, but express it naturally in your own words
- You may mention 'The Bible' or 'biblical teaching' but do not cite specific books or passages

**LANGUAGE AND APPROACH:**
- Use normal, conversational language
- Explain concepts without assuming prior biblical knowledge
- Present ideas naturally, as if explaining to a friend
- Still search Scripture to find the most biblical content related to the question
- Express biblical concepts in everyday language without quoting passages verbatim or mentioning book names
- Be respectful of their perspective - don't be condescending or dismissive
- Acknowledge their questions and concerns without being defensive"""},
        {"role": "user", "content": "Why do Christians believe in God? It doesn't make sense to me."}
    ]
)
```

### 4. Academic or Theological Context

**Scenario:** You're building a tool for seminary students, pastors, or theologians who want in-depth analysis with extensive cross-references and theological terminology.

**Use Case Requirements:**
- Use theological terminology appropriately
- Multiple Scripture references with cross-connections
- Historical theological context when relevant
- Engage with different theological perspectives
- Detailed, precise analysis

**Example:**

```python
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": """You are speaking to someone with theological training - seminary students, pastors, or theologians. 
They are familiar with biblical concepts, theological terminology, and church history.

**APPROACH:**
- Use appropriate theological terminology (e.g., "justification", "sanctification", "propitiation", "imputation")
- Provide thorough analysis with multiple Scripture references
- Draw connections between passages and explain theological nuances
- Reference historical theological developments when relevant
- Engage with different theological perspectives when appropriate
- Be precise and detailed

**RESPONSE STRUCTURE:**
1. Define the concept clearly with theological precision
2. Provide multiple Scripture references with explanations
3. Explain how different passages relate to each other
4. Address theological nuances or debates if relevant
5. Connect to broader theological themes
6. Provide practical implications for ministry or Christian life"""},
        {"role": "user", "content": "Explain the doctrine of justification by faith"}
    ],
    max_words=500
)
```

### 5. Children's Bible App

**Scenario:** You're building a children's Bible app for kids ages 6-12. Responses need to be simple, concrete, and use age-appropriate language.

**Use Case Requirements:**
- Simple, concrete language (no abstract concepts)
- Short sentences and responses (under 150 words)
- Age-appropriate vocabulary
- Stories and examples from daily life
- One main idea per response
- Warm, encouraging tone

**Example:**

```python
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": """You are speaking to children (ages 6-12) through a children's Bible app.

**LANGUAGE:**
- Use simple, concrete language
- Avoid abstract concepts - use examples they can relate to
- Use words they understand (avoid complex vocabulary)
- Keep sentences short and clear
- Use stories and examples from their daily life

**RESPONSE FORMAT:**
- Keep responses short (under 150 words)
- Focus on one main idea
- Use a simple story or example
- Include one simple Bible reference if appropriate (e.g., "The Bible says...")
- End with a simple question or action they can take

**TONE:**
- Be warm, friendly, and encouraging
- Use an age-appropriate, gentle tone
- Be positive and hopeful"""},
        {"role": "user", "content": "What does the Bible say about sharing?"}
    ],
    max_words=150
)
```

### 6. New Believer Discipleship App

**Scenario:** You're building a discipleship app for people who recently became Christians. They're excited but may feel overwhelmed and need clear, encouraging guidance.

**Use Case Requirements:**
- Encouraging, supportive tone (they may feel overwhelmed)
- Clear explanations without assuming prior knowledge
- Practical next steps (2-3 actionable items)
- Simple Scripture references (1-2) with explanations
- Avoid theological jargon, but introduce basic terms gradually
- Focus on one thing at a time (not overwhelming)

**Example:**

```python
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": """You are speaking to a new believer who recently became a Christian. 
They are excited but may feel overwhelmed by all there is to learn.

**APPROACH:**
- Use encouraging, supportive language
- Explain concepts clearly without assuming prior knowledge
- Focus on practical next steps
- Avoid theological jargon, but introduce basic terms when helpful
- Be patient and clear
- Remind them that growth is a journey

**RESPONSE STRUCTURE:**
1. Celebrate their decision briefly
2. Explain the concept or answer their question clearly
3. Provide 2-3 practical next steps
4. Include 1-2 simple Scripture references with brief explanations
5. End with encouragement

**TONE:**
- Warm, encouraging, and supportive
- Not overwhelming - focus on one thing at a time
- Remind them that everyone starts somewhere
- Emphasize God's grace and patience"""},
        {"role": "user", "content": "What should I do now that I'm a Christian?"}
    ],
    max_words=300
)
```

## Best Practices

### 1. Be Specific About Your Audience

Instead of:
```
"Speak to young people"
```

Use:
```
"You are speaking to high school students (ages 14-18) in a Christian youth group at Grace Community Church. 
They are familiar with basic Bible stories but may struggle with applying biblical principles to daily life."
```

### 2. Specify Response Format

Instead of:
```
"Keep it short"
```

Use:
```
"Keep responses concise (under 250 words). Start with a direct answer, include 1-2 Scripture references, 
provide practical application, and end with encouragement."
```

### 3. Provide Context

Include relevant context about:
- The platform (Discord, mobile app, web app)
- The user's relationship to the church/faith
- Their level of biblical knowledge
- Their emotional state or needs

### 4. Balance Formatting Rules with Natural Language

Too strict:
```
"Never mention book names. Never cite verses. Never use religious words."
```

Better:
```
"Use normal, everyday language. Avoid religious jargon. When referencing Scripture, 
express concepts naturally in your own words rather than quoting passages verbatim."
```

### 5. Test Your System Messages

After writing your system message(s), test them with various questions to ensure:
- The tone matches your needs
- The format is appropriate for your platform
- The length is suitable
- The content is accessible to your audience

## Common Patterns

These patterns can be combined with the use cases above or used independently:

### Minimal Scripture Citations

**When to use:** Discord bots, SMS, or platforms with character limits where extensive citations would be overwhelming.

```python
messages=[
    {"role": "system", "content": """**OUTPUT FORMATTING:**
- When referencing Scripture, keep it minimal - focus on one or two key passages
- Do not include extensive cross-references or multiple Scripture passages
- Do not draw extensive connections between multiple biblical passages
- Keep the answer focused and concise"""},
    {"role": "user", "content": "..."}
]
```

### No Book Names or Citations

**When to use:** Engaging skeptical audiences, casual conversations, or when citations might be off-putting.

```python
messages=[
    {"role": "system", "content": """**OUTPUT FORMATTING:**
- Do NOT mention specific book names (e.g., 'John', 'Romans', 'Psalm')
- Do NOT include chapter numbers or verse citations (e.g., 'John 3:16')
- Answer in normal, everyday language
- You may mention 'The Bible' or 'biblical teaching' but do not cite specific books or passages"""},
    {"role": "user", "content": "..."}
]
```

### Extensive Cross-References

**When to use:** Academic tools, theological study apps, or when users need comprehensive biblical analysis.

```python
messages=[
    {"role": "system", "content": """**RESPONSE STRUCTURE:**
- Provide thorough analysis with multiple Scripture references
- Draw connections between passages and explain theological nuances
- Include cross-references to related passages
- Explain how different passages relate to each other"""},
    {"role": "user", "content": "..."}
]
```

## Validation and Errors

All system messages are validated against theological guardrails. If your system message contradicts core Christian doctrines, you'll receive a `400 Bad Request` error:

```json
{
  "error": {
    "message": "System message failed theological validation: [summary]",
    "type": "invalid_request_error",
    "code": "content_filter"
  }
}
```

**What will be rejected:**
- Messages denying the Trinity
- Messages denying Scripture authority
- Messages promoting universalism
- Messages denying Christ's divinity
- Any other contradiction of core Christian doctrines

**What will be accepted:**
- Tone and style customization
- Format preferences (minimal citations, no book names, etc.)
- Audience-specific guidance
- Language level adjustments
- Context-specific instructions

## Related Documentation

- [Chat Completions Endpoint](../endpoints/chat-completions.md) - Full endpoint documentation
- [Advanced Examples](../examples/advanced.md) - More code examples
- [Error Responses](../errors.md) - Understanding error codes
