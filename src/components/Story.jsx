import { useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Helper to get current time in hh:mm format
function getTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const themeTokens = {
  light: {
    pageBg: "#f5f7fa",
    headerBg: "#3498f2",
    headerText: "#ffffff",
    subText: "#e0e0e0",
    outline: "#ffffff",
    contextBg: "#e3f2fd",
    contextText: "#333333",
    choiceBg: "#fffde7",
    choiceText: "#222222",
    phoneBg: "#ffffff",
    phoneBorder: "#222222",
  },
  dark: {
    pageBg: "#121212",
    headerBg: "#1565c0",
    headerText: "rgba(255, 255, 255, 0.95)",
    subText: "rgba(255, 255, 255, 0.70)",
    outline: "rgba(255, 255, 255, 0.80)",
    contextBg: "#1e3a5f",
    contextText: "rgba(255, 255, 255, 0.90)",
    choiceBg: "#0d47a1",
    choiceText: "rgba(255, 255, 255, 0.95)",
    phoneBg: "#1e1e1e",
    phoneBorder: "#3e3e3e",
  },
  colorblind: {
    pageBg: "#f3f0e6",
    headerBg: "#2d4f6c",
    headerText: "#ffffff",
    subText: "#e6edf3",
    outline: "#fef3c7",
    contextBg: "#e7dfc7",
    contextText: "#2b2b2b",
    choiceBg: "#fef3c7",
    choiceText: "#1f2937",
    phoneBg: "#fffdf6",
    phoneBorder: "#2b2b2b",
  },
  calm: {
    pageBg: "#e8ebe9",
    headerBg: "#7d9d8f",
    headerText: "#ffffff",
    subText: "#f0f2f1",
    outline: "#d4dbd7",
    contextBg: "#cfd9d3",
    contextText: "#3a4a42",
    choiceBg: "#b5c4ba",
    choiceText: "#2d3932",
    phoneBg: "#f5f7f6",
    phoneBorder: "#8b9d94",
  },
};

// Story flow mapping - defines what choices appear at each step
const storyFlow = {
  start: {
    choices: [
      {
        text: "Oh no, what's going on?",
        response: "He's been so angry and withdrawn since Uncle Joey died. He won't talk to any of us, everything is an argument. But it's worse than that - he's become cruel, saying hurtful things that aren't like him at all. You are the only person I can think of that knows Lazlo well enough to get through to him.",
        nextStep: "positive_path"
      },
      {
        text: "We haven't spoke for a while, are you sure I am the right person to speak to?",
        response: "I know I am asking a lot. I would not ask if I was not scared. He has been withdrawn, snapping at everyone, and shutting down. He's even said some really judgmental, almost cruel things to Mom and Dad - that's not who he is. Family is not getting through, but he used to listen to you. I need someone outside of us to try.",
        nextStep: "subtle_delay"
      },
      {
        text: "I'm really swamped right now, maybe give it a few days and see if he settles down?",
        response: "I know I'm asking a lot, but I do not think this will pass on its own. He's been shutting down, skipping meals, and snapping at everyone. Yesterday he said something really hostile to our dad that made him cry. Lazlo has never been like this. Family is not getting through. He needs someone outside of us to notice and reach him.",
        nextStep: "subtle_delay"
      },
      {
        text: "What if I say the wrong thing and make it worse?",
        response: "I've worried about that too. But I think doing nothing is worse than trying and not being perfect. At least he'll know someone cares enough to reach out.",
        nextStep: "address_doubt_about_harm"
      }
    ]
  },
  positive_path: {
    choices: [
      {
        text: "I'll go visit him in person.",
        response: "Thank you. He's at our parents' place. I really hope you can get through to him.",
        nextStep: "positive_outcome"
      },
      {
        text: "I'll try calling or texting first.",
        response: "That's a good start. He might be more open to talking that way.",
        nextStep: "positive_outcome"
      },
      {
        text: "Wait, I'm nervous - what if he doesn't want to talk to me?",
        response: "That's okay. Even if he doesn't open up right away, just knowing you reached out will matter. You don't have to fix everything, just show you care.",
        nextStep: "reassurance_path"
      },
      {
        text: "I'm not trained for this - should we call a professional instead?",
        response: "Professionals are important, but so are friends. You're not replacing therapy - you're being a supportive friend who notices when something's wrong. That's incredibly valuable.",
        nextStep: "understand_role"
      }
    ]
  },
  subtle_delay: {
    choices: [
      {
        text: "Tell me more about what you've noticed - I want to understand better",
        response: "Thank you for asking. He has been quieter, sleeping more, and skipping meals. He also stopped hanging out with friends. But what really scares me is how he's changed - he's become judgmental and says cruel things to us. That's completely unlike him. I am not sure what is normal grief anymore and what might be something more serious.",
        nextStep: "explore_warning_signs"
      },
      {
        text: "Check in with Lilly a few days later",
        response: "Hey. Thanks for checking in. Things haven't really changed... actually they might be worse. He barely leaves his room now.",
        nextStep: "delayed_response_consequences"
      },
      {
        text: "I should reach out to him now, this sounds serious",
        response: "Really? Thank you so much. I think hearing from you could really help. He's always valued your friendship.",
        nextStep: "positive_path"
      }
    ]
  },
  assess_duration: {
    choices: [
      {
        text: "Three weeks of declining behavior is a significant pattern",
        response: "That's what I was thinking too. It's not just a bad day or even a bad week. This is becoming who he is, and that scares me.",
        nextStep: "recognize_pattern_action"
      },
      {
        text: "Maybe give it another week to see if he improves?",
        response: "I'm worried that waiting longer will just make things harder. Every day he seems a little more distant. What if we lose him completely?",
        nextStep: "consequence_of_waiting"
      },
      {
        text: "But don't people just need time to grieve?",
        response: "Yes, grief takes time. But there's a difference between grieving and completely shutting down. When someone stops eating, sleeping, and seeing friends for weeks - that's beyond normal grief.",
        nextStep: "grief_education"
      },
      {
        text: "What if we're invading his privacy?",
        response: "I've thought about that. But when someone you care about is suffering, checking in isn't invading privacy - it's showing you care. We're not snooping, we're reaching out.",
        nextStep: "privacy_vs_care"
      }
    ]
  },
  recognize_communication_changes: {
    choices: [
      {
        text: "Not talking and avoiding eye contact are concerning signs",
        response: "Exactly! He used to be so open with us. This complete shutdown is what's really frightening me. And when he does talk, he's become so harsh and judgmental. I think he needs help.",
        nextStep: "positive_path"
      },
      {
        text: "What about his daily routine - eating, sleeping?",
        response: "His sleep is all messed up - he's either sleeping all day or I hear him up all night. And meals... he says he's not hungry but I found food hidden in his room that he didn't eat.",
        nextStep: "physical_warning_signs"
      },
      {
        text: "Can you tell me more about how his personality has changed?",
        response: "He's become someone I don't recognize. He used to be empathetic and kind, but now he's critical of everything we do. He makes cutting remarks that feel designed to hurt. It's like he's pushing us all away on purpose.",
        nextStep: "personality_change_discussion"
      },
      {
        text: "He's probably just being a moody teenager",
        response: "I really don't think so. I've known him his whole life. Moody is one thing - but cruel and hostile is another. The things he's said lately... they're designed to hurt. This feels... dangerous. But maybe I'm wrong?",
        nextStep: "dismissive_response_consequence"
      },
      {
        text: "I'm worried I'll just make him feel worse about himself",
        response: "I understand that fear. But isolation makes people feel worse. Reaching out says 'you matter to me' - that can be really powerful when someone feels invisible.",
        nextStep: "impact_of_reaching_out"
      },
      {
        text: "What if he gets angry at me for interfering?",
        response: "He might be defensive at first - that's actually pretty common. But underneath that, he'll know someone cares. Sometimes people push away when they need help most.",
        nextStep: "handling_pushback"
      }
    ]
  },
  physical_warning_signs: {
    choices: [
      {
        text: "Changes in sleep and appetite are serious warning signs",
        response: "That's what I was afraid of. So this isn't just grief - this could be something more serious like depression?",
        nextStep: "educational_moment"
      },
      {
        text: "These symptoms together suggest he needs support now",
        response: "Thank you for helping me see this clearly. I've been so worried but didn't know if I was overreacting. Let's reach out to him.",
        nextStep: "positive_path"
      },
      {
        text: "I don't know... aren't we supposed to respect when people want space?",
        response: "There's a difference between wanting alone time and isolating to the point of harm. When someone can't eat or sleep normally for weeks, that's not healthy space - that's suffering.",
        nextStep: "space_vs_isolation"
      },
      {
        text: "What if I'm not equipped to handle his response?",
        response: "You don't need to have all the answers. Just listening and showing you care is powerful. If he needs more help, you can support him in finding it. You're not alone in this.",
        nextStep: "support_role_clarity"
      }
    ]
  },
  explore_warning_signs: {
    choices: [
      {
        text: "How long has this been going on?",
        response: "About three weeks now. At first I thought it was just normal grief, but it keeps getting worse. He's isolating himself more every day.",
        nextStep: "assess_duration"
      },
      {
        text: "Has he said anything about how he's feeling?",
        response: "That's the thing - he won't talk about it. He just says 'I'm fine' but everything about him says he's not. He won't even look us in the eye anymore.",
        nextStep: "recognize_communication_changes"
      },
      {
        text: "You mentioned he's been saying cruel things? That's concerning.",
        response: "Yes... that's what really worries me. He told Mom she was suffocating him and said Dad doesn't understand anything. These aren't just teenager complaints - they were mean, bordering on hostile. Lazlo used to be so kind.",
        nextStep: "personality_change_discussion"
      },
      {
        text: "These sound like warning signs - we should act now",
        response: "You really think so? I was worried I might be overreacting... Thank you for taking this seriously.",
        nextStep: "positive_path"
      },
      {
        text: "I'm honestly not sure I'd know what to look for...",
        response: "That's okay - I can tell you what I've noticed. Changes in sleep, appetite, withdrawing from friends, loss of interest in things he used to love. Multiple changes together are what worry me.",
        nextStep: "learn_warning_signs"
      }
    ]
  },
  recognize_pattern_action: {
    choices: [
      {
        text: "Let's reach out to him together - what's your plan?",
        response: "I think if you could text him, just to check in? He might respond better to you than to family right now.",
        nextStep: "positive_path"
      },
      {
        text: "What other warning signs should we be looking for?",
        response: "I've read that giving away possessions, talking about being a burden, or sudden mood changes can be serious. I haven't seen those yet, but the isolation and withdrawal worry me.",
        nextStep: "educational_moment"
      }
    ]
  },
  educational_moment: {
    choices: [
      {
        text: "These signs together suggest we need to act now",
        response: "You're right. I feel better knowing you understand why I'm so worried. Let's reach out to him.",
        nextStep: "positive_path"
      },
      {
        text: "Should we also tell his parents or a counselor?",
        response: "That's a good idea. Let's start by reaching out to him, and then we can decide together if he needs more support.",
        nextStep: "positive_path"
      }
    ]
  },
  personality_change_discussion: {
    choices: [
      {
        text: "Sudden personality changes like hostility are a major red flag",
        response: "That's what I thought. He's always been gentle and thoughtful. Seeing him lash out and say cruel things... it's like he's not himself. This isn't just grief, is it?",
        nextStep: "understand_personality_changes"
      },
      {
        text: "What kind of things has he been saying?",
        response: "He told Mom she was pathetic for crying over Uncle Joey. He said Dad was weak for showing emotion. These are things Lazlo would never say normally. It's like he's trying to hurt the people who love him most.",
        nextStep: "hostile_behavior_details"
      },
      {
        text: "Maybe he's just angry about the loss?",
        response: "Anger is normal in grief, but this feels different. It's not just anger - it's directed cruelty. He seems to know exactly what will hurt most and says it anyway. That's what scares me.",
        nextStep: "distinguish_anger_from_hostility"
      },
      {
        text: "This sounds really serious - we should reach out now",
        response: "Yes, I think so too. When someone changes this dramatically, it's a cry for help even if they're pushing people away.",
        nextStep: "positive_path"
      }
    ]
  },
  understand_personality_changes: {
    choices: [
      {
        text: "No, dramatic personality changes suggest serious distress",
        response: "I was afraid of that. So the isolation, the physical symptoms, and now this cruelty - they're all connected?",
        nextStep: "connect_symptoms"
      },
      {
        text: "We need to act fast before he hurts himself or damages these relationships permanently",
        response: "You're right. Even if he's in pain, the damage he's doing to our family... we need to help him before he can't take it back.",
        nextStep: "positive_path"
      }
    ]
  },
  hostile_behavior_details: {
    choices: [
      {
        text: "That level of cruelty isn't normal - even in grief",
        response: "Thank you for validating that. I keep second-guessing myself, wondering if I'm overreacting, but this really isn't like him.",
        nextStep: "positive_path"
      },
      {
        text: "It sounds like he's pushing people away deliberately",
        response: "Yes! That's exactly what it feels like. Like he's testing how much we'll take before we give up on him. Which makes me even more worried about what's going on in his head.",
        nextStep: "understand_pushing_away"
      }
    ]
  },
  distinguish_anger_from_hostility: {
    choices: [
      {
        text: "You're right - there's a difference between grief anger and calculated cruelty",
        response: "Exactly. Grief makes you lash out sometimes, but this feels intentional. Like he wants us to hate him. That can't be healthy.",
        nextStep: "positive_path"
      },
      {
        text: "Why would someone deliberately try to hurt people who love them?",
        response: "Sometimes when people are in pain, they push others away because they feel unworthy of love, or they're trying to protect people from their darkness. But it makes them more isolated and can be dangerous.",
        nextStep: "psychology_of_pushing_away"
      }
    ]
  },
  connect_symptoms: {
    choices: [
      {
        text: "Yes - they're all signs of someone in serious distress",
        response: "That makes sense. So it's not separate issues - it's all one big cry for help that we need to answer.",
        nextStep: "positive_path"
      },
      {
        text: "Tell me how they're connected",
        response: "When someone is struggling deeply - maybe with depression or trauma - it affects everything: sleep, appetite, mood, and how they treat others. The hostility might be his way of expressing pain he can't put into words.",
        nextStep: "positive_path"
      }
    ]
  },
  understand_pushing_away: {
    choices: [
      {
        text: "People sometimes push others away when they're struggling most",
        response: "That's terrifying. So the more cruel he is, the more it might mean he needs help? We can't give up on him.",
        nextStep: "positive_path"
      },
      {
        text: "We need to reach out despite the hostility, not because of it",
        response: "You're right. Even if he's being cruel, we need to see past that to the pain underneath. Let's do this.",
        nextStep: "positive_path"
      }
    ]
  },
  psychology_of_pushing_away: {
    choices: [
      {
        text: "Understanding this makes me more determined to help him",
        response: "Me too. He's not being cruel because he's a bad person - he's being cruel because he's hurting. That's something we can address.",
        nextStep: "positive_path"
      },
      {
        text: "So we shouldn't take his words personally?",
        response: "Exactly. It's hard not to, but his cruelty is about his pain, not about us. We can be hurt by it and still recognize he needs help.",
        nextStep: "positive_path"
      }
    ]
  },
  consequence_of_waiting: {
    choices: [
      {
        text: "You're right - every day matters. Let's act now.",
        response: "Thank you for listening. I knew reaching out to you was the right choice. Let's help Lazlo.",
        nextStep: "positive_path"
      },
      {
        text: "But what if we're just being dramatic?",
        response: "I'd rather be dramatic and wrong than casual and regret it. When it comes to someone's wellbeing, isn't it better to care too much than too little?",
        nextStep: "reflection_on_action"
      }
    ]
  },
  dismissive_response_consequence: {
    choices: [
      {
        text: "Wait, tell me more - I want to understand better",
        response: "Thank you for reconsidering. He's shown these behaviors: withdrawal, sleep changes, skipping meals, avoiding friends, can't make eye contact, and he's become hostile and cruel - saying hurtful things that aren't like him. Together, these paint a concerning picture.",
        nextStep: "physical_warning_signs"
      },
      {
        text: "I think you know him best - trust your instincts",
        response: "You're right. My gut has been screaming that something is wrong. I should trust that. Will you help me reach out to him?",
        nextStep: "positive_path"
      },
      {
        text: "Let's check back in a week and see if he improves",
        response: "Okay... I hope you're right and I'm just worrying too much. I'll reach out next week...",
        nextStep: "delayed_response_consequences"
      }
    ]
  },
  reflection_on_action: {
    choices: [
      {
        text: "You're absolutely right - let's reach out now",
        response: "Thank you. Sometimes we second-guess ourselves when someone needs help, but action is always better than inaction.",
        nextStep: "positive_path"
      },
      {
        text: "I guess I'll wait and see what happens",
        response: "I understand you're hesitant, but I can't shake this feeling. I really hope things get better on their own...",
        nextStep: "delayed_response_consequences"
      }
    ]
  },
  delayed_response_consequences: {
    choices: [
      {
        text: "Check back a week later",
        response: "Hey... things have gotten worse. Lazlo stopped going to school this week. His teacher called home. I should have pushed harder when you first said to wait.",
        nextStep: "learn_from_delay"
      },
      {
        text: "Actually, I changed my mind - let's reach out now",
        response: "Really? Oh thank god. I've been so anxious about this. I really think we need to act sooner rather than later.",
        nextStep: "explore_warning_signs"
      }
    ]
  },
  late_intervention_path: {
    choices: [
      {
        text: "Reach out to Lazlo now, even though time has passed",
        response: "He responded... He said he's been feeling invisible, like no one cares. It's going to take more work now, but at least he's talking. Early intervention would have been easier.",
        nextStep: "story_end_lesson"
      },
      {
        text: "Ask what specific signs we should have caught earlier",
        response: "The isolation, the sleep and eating changes, the withdrawal from friends, and especially the personality changes - the hostility and cruel comments. These together for weeks were the red flags. One sign might be nothing, but multiple signs persisting? That's when you act.",
        nextStep: "educational_reflection"
      }
    ]
  },
  educational_reflection: {
    choices: [
      {
        text: "I understand now. Let's help him moving forward.",
        response: "Yes. And now you know: trust your instincts when you see changes, ask questions, and don't wait for things to get worse before acting.",
        nextStep: "story_end_lesson"
      },
      {
        text: "Can we try again with this knowledge?",
        response: "Let's imagine I'm reaching out to you for the first time again. This time you know what to look for...",
        nextStep: "subtle_delay"
      }
    ]
  },
  early_help_positive: {
    choices: [
      {
        text: "What made the difference in reaching out early?",
        response: "You took the warning signs seriously, you asked questions instead of dismissing concerns, and you acted quickly. That's what helped Lazlo feel seen and supported when he needed it most.",
        nextStep: "story_end_good"
      }
    ]
  },
  address_doubt_about_harm: {
    choices: [
      {
        text: "You're right - showing care is better than staying silent",
        response: "Exactly. You don't have to be perfect. Just being there matters more than saying the perfect thing.",
        nextStep: "positive_path"
      },
      {
        text: "But what's the right thing to say?",
        response: "Keep it simple: 'I've noticed you seem different lately. I care about you and I'm here if you want to talk.' You don't need a script - just sincerity.",
        nextStep: "communication_guidance"
      },
      {
        text: "I'm still really nervous about this...",
        response: "That's totally normal. Caring about doing it right shows you take this seriously. Would it help to talk through what you might say?",
        nextStep: "practice_conversation"
      }
    ]
  },
  reassurance_path: {
    choices: [
      {
        text: "Okay, I'll reach out even if I'm nervous",
        response: "That's brave. Being nervous means you care. Lazlo will appreciate that you reached out despite feeling unsure.",
        nextStep: "positive_outcome"
      },
      {
        text: "What if the conversation goes badly?",
        response: "Even awkward conversations about mental health are better than no conversation. You're planting a seed - he'll remember that you tried, even if he's not ready to talk yet.",
        nextStep: "conversation_expectations"
      }
    ]
  },
  understand_role: {
    choices: [
      {
        text: "So I'm just checking in as a friend, not trying to fix everything?",
        response: "Exactly! You're showing up, listening, and letting him know he's not alone. If he needs professional help, you can encourage that too. Friends are part of the support network.",
        nextStep: "positive_outcome"
      },
      {
        text: "That makes sense. I can do that.",
        response: "I think so too. Sometimes just knowing someone notices and cares makes all the difference.",
        nextStep: "positive_outcome"
      }
    ]
  },
  learn_warning_signs: {
    choices: [
      {
        text: "So multiple changes persisting over time is the key?",
        response: "Yes! One bad day is normal. But several symptoms lasting weeks - that's a pattern. Isolation + sleep changes + appetite changes + withdrawal from activities + hostile personality changes = time to act.",
        nextStep: "positive_path"
      },
      {
        text: "This is helpful - I want to understand better",
        response: "I'm glad. Other signs can include giving away possessions, talking about being a burden, sudden mood changes, or becoming cruel and judgmental. But what I'm seeing now is already concerning enough.",
        nextStep: "educational_moment"
      }
    ]
  },
  grief_education: {
    choices: [
      {
        text: "I see the difference now. Let's reach out.",
        response: "Thank you. Grief is painful but people still function. This level of shutdown is different - it needs attention.",
        nextStep: "positive_path"
      },
      {
        text: "How do you know when grief becomes something more serious?",
        response: "When it stops someone from basic functioning - eating, sleeping, connecting with others. When it lasts for weeks without any improvement. That's when normal grief might have become depression or crisis.",
        nextStep: "recognize_pattern_action"
      }
    ]
  },
  privacy_vs_care: {
    choices: [
      {
        text: "You're right - care matters more than privacy here",
        response: "Exactly. We're not reading his diary, we're just asking if he's okay. That's what friends do.",
        nextStep: "positive_path"
      },
      {
        text: "I guess I'm just worried about overstepping",
        response: "I understand. But consider this: would you rather overstep and find out he's fine, or respect privacy and find out too late that he wasn't?",
        nextStep: "consequence_of_waiting"
      }
    ]
  },
  impact_of_reaching_out: {
    choices: [
      {
        text: "That's a good point. Isolation is worse than awkwardness.",
        response: "Yes! Even if he doesn't open up immediately, he'll know he's not forgotten. That matters more than you might think.",
        nextStep: "positive_path"
      },
      {
        text: "What should I actually say to him?",
        response: "Something like: 'Hey, I've been thinking about you. You seem different lately and I'm worried. I'm here if you want to talk.' Simple and honest.",
        nextStep: "communication_guidance"
      }
    ]
  },
  handling_pushback: {
    choices: [
      {
        text: "So even if he's defensive, I shouldn't give up?",
        response: "Right. You might hear 'I'm fine' or 'leave me alone.' But you can say 'Okay, but I'm here if you change your mind.' Then check in again later. Persistence shows you really care.",
        nextStep: "positive_path"
      },
      {
        text: "That sounds hard. I'm not sure I can handle rejection.",
        response: "It is hard. But remember - it's not about you. If he pushes back, it's his pain speaking, not his real feelings about you. Can you be brave for him?",
        nextStep: "courage_to_act"
      }
    ]
  },
  space_vs_isolation: {
    choices: [
      {
        text: "I understand now - this isn't healthy space",
        response: "Exactly. Healthy space is temporary and chosen. This is prolonged isolation that's hurting him. Let's help.",
        nextStep: "positive_path"
      },
      {
        text: "How do I know the difference?",
        response: "Healthy space: person still functions, returns to normal activities. Isolation: withdrawing from everything and everyone, declining health, lasting weeks. See the difference?",
        nextStep: "educational_moment"
      }
    ]
  },
  support_role_clarity: {
    choices: [
      {
        text: "Okay, I can do that - just be there and listen",
        response: "Yes! And if he needs more help, you can suggest talking to a counselor or therapist together. You're part of his support team, not the whole team.",
        nextStep: "positive_outcome"
      },
      {
        text: "That takes the pressure off. I'll reach out.",
        response: "Good. You don't have to fix him - just show up. That's enough.",
        nextStep: "positive_outcome"
      }
    ]
  },
  communication_guidance: {
    choices: [
      {
        text: "That's simple and clear. I can do that.",
        response: "Perfect. Authenticity matters more than perfection. He'll feel your genuine concern.",
        nextStep: "positive_outcome"
      },
      {
        text: "What if he says he's fine but I don't believe him?",
        response: "You can say 'I hear you, but I've noticed [specific changes]. I care about you and want to make sure you're really okay.' Specific observations are hard to dismiss.",
        nextStep: "positive_outcome"
      }
    ]
  },
  conversation_expectations: {
    choices: [
      {
        text: "So even an imperfect attempt is worthwhile",
        response: "Absolutely. The attempt itself communicates caring. Perfect isn't the goal - showing up is.",
        nextStep: "positive_outcome"
      },
      {
        text: "That makes me feel better. I'll try.",
        response: "That's all anyone can ask. Your willingness to be uncomfortable for someone else's wellbeing? That's true friendship.",
        nextStep: "positive_outcome"
      }
    ]
  },
  courage_to_act: {
    choices: [
      {
        text: "Yes, I can be brave for him. I'll reach out.",
        response: "That's the spirit. Your courage could save his life. Let's do this.",
        nextStep: "positive_outcome"
      },
      {
        text: "I need more time to prepare myself",
        response: "I understand it's scary. But the longer we wait, the harder it gets for him. Could you reach out today, even if you're not totally ready?",
        nextStep: "reflection_on_action"
      }
    ]
  },
  practice_conversation: {
    choices: [
      {
        text: "Yes, let's practice what I might say",
        response: "Great. Start with 'I've noticed you haven't been yourself lately' then ask 'How are you really doing?' Keep it open-ended so he can share what he needs to.",
        nextStep: "communication_guidance"
      },
      {
        text: "Actually, I think I'm ready to just reach out",
        response: "That's great! Trust yourself. You care about him - that will come through.",
        nextStep: "positive_outcome"
      }
    ]
  },
  signs_overlooked: {
    choices: [
      {
        text: "Check back with Lilly a week later",
        response: "Hey... I don't know how to say this. Lazlo hasn't been to school all week. I found out he told his counselor he doesn't see the point. I should have looked closer when you called. I wish I'd pushed harder.",
        nextStep: "late_realization"
      },
      {
        text: "Actually, wait - I should check in now, not later",
        response: "Really? Thank you. I was just about to reach out again. I'm still really worried about him.",
        nextStep: "subtle_delay"
      }
    ]
  },
  late_realization: {
    choices: [
      {
        text: "Reach out to Lazlo now",
        response: "He is surprised to hear from you, but he's willing to talk. It helps, but it's harder now. The signs were there earlier.",
        nextStep: "story_end_lesson"
      },
      {
        text: "Think about what you could have done differently",
        response: "Looking back, I wish I had asked more questions when you first reached out. Maybe if I understood better... Can we talk through what happened?",
        nextStep: "reflection_loop"
      }
    ]
  },
  reflection_loop: {
    choices: [
      {
        text: "Go back and approach this differently",
        response: "Hey, it's Lilly again. I know we talked before, but I'm still really worried about Lazlo. Are you sure there's nothing you can do?",
        nextStep: "subtle_delay"
      },
      {
        text: "Accept the outcome and finish",
        response: "I guess we just have to deal with where we are now. I learned that waiting has consequences.",
        nextStep: "story_end_lesson"
      }
    ]
  },
  positive_outcome: {
    choices: [
      {
        text: "See the difference your action made",
        response: "Because you reached out when you did, Lazlo felt like someone cared. He opened up earlier. Your timing made it easier for him to get support.",
        nextStep: "story_end_good"
      }
    ]
  },
  story_end_good: {
    choices: [
      {
        text: "What were the key lessons here?",
        response: "✓ You recognized warning signs early\n✓ You asked questions to understand better\n✓ You took action quickly\n✓ Early intervention makes all the difference\n\nLazlo got the help he needed because someone noticed and cared enough to act.",
        nextStep: "final_restart"
      }
    ]
  },
  story_end_lesson: {
    choices: [
      {
        text: "What could I have done differently?",
        response: "Key lessons:\n⚠ Multiple warning signs together need immediate attention\n⚠ Waiting to see if things improve can make situations worse\n⚠ It's better to check in and be wrong than not check in at all\n⚠ Trust your instincts when someone you care about changes\n\nYou helped eventually, but early action is always better.",
        nextStep: "final_restart"
      }
    ]
  },
  final_restart: {
    choices: [
      {
        text: "Try Again from Beginning",
        response: "",
        nextStep: "start"
      },
      {
        text: "Practice recognizing warning signs again",
        response: "Good idea. Let's go through the scenario again, and this time you'll know what to look for from the start.",
        nextStep: "subtle_delay"
      }
    ]
  }
};

export default function Story() {
  const [theme, setTheme] = useState("light");
  const [currentStep, setCurrentStep] = useState("start");
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const t = themeTokens[theme];
  const [chat, setChat] = useState([
    {
      id: Date.now().toString(),
      sender: "Lilly",
      text: "Hey Evan, it's Lilly - Lazlo's sister. I know you're really busy with your job nowadays but I wanted to reach out because I'm really worried about Lazlo.",
      time: getTime()
    }
  ]);

  // Auto-scroll to bottom when chat updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [chat]);

  // Get current choices based on story step with fallback
  const currentChoices = storyFlow[currentStep]?.choices || [];

  // Validate story step exists
  const isValidStep = storyFlow[currentStep] !== undefined;
  if (!isValidStep && currentStep !== 'start') {
    console.warn(`Invalid story step: ${currentStep}`);
  }

  // Handle choice click with error handling
  const handleChoice = (choiceText, responseText, nextStep) => {
    try {
      console.log('handleChoice called with text:', choiceText, 'nextStep:', nextStep);
      
      // Validate inputs
      if (!choiceText || !responseText || !nextStep) {
        console.error('Invalid choice data:', { choiceText, responseText, nextStep });
        return;
      }

      // Validate next step exists in story flow
      if (!storyFlow[nextStep]) {
        console.error(`Next step does not exist: ${nextStep}`);
        return;
      }
      
      // Add user's choice to chat
      setChat((prev) => [
        ...prev,
        { 
          id: Date.now().toString(), 
          sender: "You", 
          text: choiceText,
          time: getTime() 
        }
      ]);
      
      setSelectedChoices((prev) => [...prev, choiceText]);
      
      // Show typing indicator
      setIsTyping(true);
      
      // Add Lilly's response after a delay
      setTimeout(() => {
        try {
          setChat((prev) => [
            ...prev,
            { 
              id: (Date.now() + 1).toString(), 
              sender: "Lilly", 
              text: responseText,
              time: getTime() 
            }
          ]);
          
          // Hide typing indicator
          setIsTyping(false);
          
          // Progress to next step
          setCurrentStep(nextStep);
        } catch (error) {
          console.error('Error updating chat after response:', error);
          setIsTyping(false);
        }
      }, 900);
    } catch (error) {
      console.error('Error in handleChoice:', error);
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', background: t.pageBg }} component="main" role="main">
      {/* Skip to main content link */}
      <Box sx={{ 
        position: 'absolute', 
        left: '-999px', 
        width: '1px', 
        height: '1px', 
        top: 'auto',
        '&:focus': {
          position: 'fixed',
          top: 10,
          left: 10,
          width: 'auto',
          height: 'auto',
          bgcolor: '#1976d2',
          color: '#fff',
          p: 2,
          zIndex: 9999,
          borderRadius: 1
        }
      }}>
        <a href="#story-choices" style={{ color: '#fff', textDecoration: 'none' }}>
          Skip to story choices
        </a>
      </Box>
      <Box sx={{
        width: '100%',
        bgcolor: t.headerBg,
        py: { xs: 2, md: 3 },
        px: { xs: 1, sm: 2 },
        borderRadius: '0 0 24px 24px',
        position: 'relative',
        boxSizing: 'border-box',
        maxWidth: '100vw',
        overflow: 'hidden',
        minHeight: { xs: 120, md: 160 }
      }}>
        {/* Top right: Save, Load, Restart */}
        <Box sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          zIndex: 2
        }}>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 700, borderRadius: 2, minWidth: 80 }}
            aria-label="Restart story from beginning"
          >
            Restart
          </Button>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 700, borderRadius: 2, minWidth: 80 }}
            aria-label="Save current progress"
          >
            Save
          </Button>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 700, borderRadius: 2, minWidth: 80 }}
            aria-label="Load saved progress"
          >
            Load
          </Button>
        </Box>
        <Box sx={{
          maxWidth: 900,
          mx: 'auto',
          px: { xs: 1, sm: 2 },
          textAlign: 'center',
          wordBreak: 'break-word',
        }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: t.headerText,
              fontWeight: 700,
              letterSpacing: 1,
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
              lineHeight: 1.2,
              wordBreak: 'break-word',
              whiteSpace: 'normal',
            }}
          >
            HELI - Helping Everyone Learn Interactively
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              color: t.subText,
              mt: 1,
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              lineHeight: 1.3,
              wordBreak: 'break-word',
              whiteSpace: 'normal',
            }}
          >
            Safeguarding Scenario: Recognizing and Responding to Concerns
          </Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mt: 2,
          flexWrap: 'wrap',
          zIndex: 1
        }}
          role="group"
          aria-label="Theme selection"
        >
          <Button
            variant={theme === "light" ? "contained" : "outlined"}
            onClick={() => setTheme("light")}
            aria-label="Switch to light theme"
            aria-pressed={theme === "light"}
            sx={{
              color: theme === "light" ? t.headerBg : t.outline,
              borderColor: t.outline,
              bgcolor: theme === "light" ? t.outline : "transparent",
              fontWeight: 700,
            }}
          >
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "contained" : "outlined"}
            onClick={() => setTheme("dark")}
            aria-label="Switch to dark theme"
            aria-pressed={theme === "dark"}
            sx={{
              color: theme === "dark" ? t.headerBg : t.outline,
              borderColor: t.outline,
              bgcolor: theme === "dark" ? t.outline : "transparent",
              fontWeight: 700,
            }}
          >
            Dark
          </Button>
          <Button
            variant={theme === "colorblind" ? "contained" : "outlined"}
            onClick={() => setTheme("colorblind")}
            aria-label="Switch to colorblind-friendly theme"
            aria-pressed={theme === "colorblind"}
            sx={{
              color: theme === "colorblind" ? t.headerBg : t.outline,
              borderColor: t.outline,
              bgcolor: theme === "colorblind" ? t.outline : "transparent",
              fontWeight: 700,
            }}
          >
            Colorblind
          </Button>
          <Button
            variant={theme === "calm" ? "contained" : "outlined"}
            onClick={() => setTheme("calm")}
            aria-label="Switch to calm low-stimulation theme"
            aria-pressed={theme === "calm"}
            sx={{
              color: theme === "calm" ? t.headerBg : t.outline,
              borderColor: t.outline,
              bgcolor: theme === "calm" ? t.outline : "transparent",
              fontWeight: 700,
            }}
          >
            Calm
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', alignItems: 'flex-start', mt: 4, gap: 4, px: 2 }}>
        {/* Left: Story context and choices */}
        <Box sx={{ flex: 1, minWidth: 350, maxWidth: 600, pr: 2 }} component="section" aria-labelledby="story-context-heading">
          {/* Story context */}
          <Box sx={{ bgcolor: t.contextBg, borderRadius: 2, boxShadow: 1, p: 3, mb: 2 }} role="article">
            <Typography variant="h3" component="h3" id="story-context-heading" sx={{ color: t.contextText, fontWeight: 500, fontSize: '1rem', mb: 1, srOnly: { position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' } }}>
              Story Context
            </Typography>
            <Typography variant="body1" sx={{ color: t.contextText, fontWeight: 500 }}>
              You receive a message from a school friend's sister. She's concerned about her brother because he's been acting out of character.
            </Typography>
          </Box>
          {/* Choices */}
          <Box 
            id="story-choices"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            role="group"
            aria-labelledby="choices-heading"
          >
            <Typography 
              variant="h3" 
              component="h3" 
              id="choices-heading"
              sx={{ 
                fontSize: '1.1rem', 
                fontWeight: 600, 
                color: t.contextText,
                mb: 1,
                position: 'absolute',
                left: '-10000px',
                top: 'auto',
                width: '1px',
                height: '1px',
                overflow: 'hidden'
              }}
            >
              Available Choices
            </Typography>
            {Array.isArray(currentChoices) && currentChoices.length > 0 ? (
              currentChoices.map((choice, idx) => {
                // Safely validate choice data
                if (!choice || typeof choice !== 'object') {
                  console.warn('Invalid choice object:', choice);
                  return null;
                }
                
                const { text, response, nextStep } = choice;
                if (!text || !response || !nextStep) {
                  console.warn('Invalid choice data (missing required fields):', choice);
                  return null;
                }

                return (
                  <Button
                    key={idx}
                    variant="contained"
                    aria-label={`Choice ${idx + 1}: ${text}`}
                    aria-disabled={selectedChoices.includes(text)}
                    sx={{
                      color: t.choiceText,
                      bgcolor: t.choiceBg,
                      borderColor: '#ffe082',
                      fontWeight: 700,
                      boxShadow: 1,
                      textAlign: 'center',
                      '&:hover': { bgcolor: '#ffe082' },
                      '&:focus': {
                        outline: '3px solid #1976d2',
                        outlineOffset: '2px'
                      }
                    }}
                    onClick={() => handleChoice(text, response, nextStep)}
                    disabled={selectedChoices.includes(text)}
                  >
                    {text}
                  </Button>
                );
              })
            ) : (
              <Typography variant="body2" sx={{ color: t.contextText, fontStyle: 'italic' }} role="status" aria-live="polite">
                {currentChoices.length === 0 ? 'No choices available for this step.' : 'Error loading choices.'}
              </Typography>
            )}
          </Box>
        </Box>
        {/* Right: Phone mockup with chat */}
        <Box sx={{ flex: 1, minWidth: 350, maxWidth: 400, display: 'flex', justifyContent: 'center' }} component="section" aria-labelledby="chat-heading">
          <Typography 
            variant="h3" 
            component="h3" 
            id="chat-heading"
            sx={{ 
              position: 'absolute',
              left: '-10000px',
              top: 'auto',
              width: '1px',
              height: '1px',
              overflow: 'hidden'
            }}
          >
            Chat Conversation with Lilly
          </Typography>
          <Box sx={{
            width: 320,
            height: 600,
            bgcolor: t.phoneBg,
            borderRadius: '32px',
            boxShadow: 6,
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            position: 'relative',
            border: `10px solid ${t.phoneBorder}`,
            overflow: 'hidden',
          }}>
            {/* Phone notch */}
            <Box sx={{ width: 80, height: 12, bgcolor: '#222', borderRadius: 6, position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 3 }} />
            
            {/* Minimal Status Bar */}
            <Box sx={{
              width: '100%',
              height: 14,
              bgcolor: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1.6,
              py: 0.4,
              zIndex: 2,
            }}>
              <Typography sx={{ color: '#fff', fontSize: '0.45rem', fontWeight: 600, ml: 0.6 }}>{getTime()}</Typography>
              <Box sx={{ display: 'flex', gap: 0.6, alignItems: 'center', mr: 3.75 }}>
                {/* Signal bars */}
                <Box sx={{ display: 'flex', gap: '0.5px', alignItems: 'flex-end', height: '5px' }}>
                  <Box sx={{ width: '1px', height: '2px', bgcolor: '#fff' }} />
                  <Box sx={{ width: '1px', height: '3px', bgcolor: '#fff' }} />
                  <Box sx={{ width: '1px', height: '4px', bgcolor: '#fff' }} />
                  <Box sx={{ width: '1px', height: '5px', bgcolor: '#fff' }} />
                </Box>
                
                {/* WiFi symbol */}
                <Box sx={{ width: '5px', height: '5px', position: 'relative' }}>
                  <Box sx={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '1px', height: '1px', bgcolor: '#fff', borderRadius: '50%' }} />
                  <Box sx={{ position: 'absolute', bottom: '1px', left: '50%', transform: 'translateX(-50%)', width: '3px', height: '3px', border: '0.5px solid #fff', borderRadius: '50%', borderTop: 'none', borderLeft: 'none' }} />
                </Box>
                
                {/* Message/SMS icon */}
                <Box sx={{ width: '5px', height: '4px', border: '0.5px solid #fff', borderRadius: '0.5px', position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: '0.5px', left: '0', right: '0', height: '0.5px', bgcolor: '#fff' }} />
                </Box>
              </Box>
            </Box>
            
            {/* Contact header */}
            <Box sx={{
              width: '100%',
              height: 46,
              bgcolor: '#f5f7fa',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              py: 0.6,
              zIndex: 1,
            }}>
              <Box sx={{
                width: 32,
                height: 32,
                bgcolor: '#b3c6e0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14,
                color: '#222',
                mr: 1,
              }}>
                L
              </Box>
              <Typography variant="subtitle2" sx={{ color: '#222', fontWeight: 600, fontSize: 13 }}>
                Lilly (Lazlo's Sister)
              </Typography>
            </Box>
            {/* Chat bubbles */}
            <Box sx={{
              flex: 1,
              mb: 0,
              mt: 0,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.8,
              px: 1,
              pb: 0.5,
              pt: 0.8,
              boxSizing: 'border-box',
              width: '100%',
              maxWidth: '100%',
            }}>
              {Array.isArray(chat) && chat.map((msg) => {
                // Safely validate message data
                if (!msg || typeof msg !== 'object') {
                  console.warn('Invalid message object:', msg);
                  return null;
                }
                
                const { id, sender, text, time } = msg;
                if (!id || !sender || !text) {
                  console.warn('Invalid message data (missing required fields):', msg);
                  return null;
                }

                return (
                  <Box
                    key={id}
                    role="article"
                    aria-label={`Message from ${sender} at ${time || 'unknown time'}`}
                    sx={{
                      alignSelf: sender === "You" ? 'flex-end' : 'flex-start',
                      bgcolor: sender === "You"
                        ? '#1976d2'
                        : '#f1f0f0',
                      color: sender === "You" ? '#fff' : '#222',
                      borderRadius: '12px',
                      p: 0.8,
                      px: 1.2,
                      maxWidth: '78%',
                      fontSize: '0.85rem',
                      boxShadow: 1,
                      mb: 0.5,
                      wordBreak: 'break-word',
                      fontFamily: 'Arial, sans-serif',
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                      {String(text)}
                    </div>
                    <div style={{ 
                      fontSize: '0.65rem', 
                      marginTop: '2px',
                      color: sender === "You" ? '#cbe2ff' : '#888'
                    }}>
                      <time dateTime={time}>{time || 'No time'}</time>
                    </div>
                  </Box>
                );
              })}  
              {isTyping && (
                <Box
                  sx={{
                    alignSelf: 'flex-start',
                    display: 'flex',
                    gap: 0.3,
                    p: 0.8,
                    px: 1,
                  }}
                  role="status"
                  aria-live="polite"
                  aria-label="Lilly is typing a message"
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      bgcolor: '#999',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite',
                      '@keyframes bounce': {
                        '0%, 80%, 100%': {
                          opacity: 0.5,
                          transform: 'translateY(0)',
                        },
                        '40%': {
                          opacity: 1,
                          transform: 'translateY(-6px)',
                        },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      bgcolor: '#999',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite',
                      animationDelay: '0.2s',
                      '@keyframes bounce': {
                        '0%, 80%, 100%': {
                          opacity: 0.5,
                          transform: 'translateY(0)',
                        },
                        '40%': {
                          opacity: 1,
                          transform: 'translateY(-6px)',
                        },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      bgcolor: '#999',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s infinite',
                      animationDelay: '0.4s',
                      '@keyframes bounce': {
                        '0%, 80%, 100%': {
                          opacity: 0.5,
                          transform: 'translateY(0)',
                        },
                        '40%': {
                          opacity: 1,
                          transform: 'translateY(-6px)',
                        },
                      },
                    }}
                  />
                </Box>
              )}
              <div ref={chatEndRef} />
            </Box>
            {/* Typing indicator and input */}
            <Box sx={{ px: 1, py: 1 }}>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <input style={{ flex: 1, borderRadius: 16, border: '1px solid #ccc', padding: '6px 10px', fontSize: '0.9rem' }} placeholder="Message..." />
                <Button variant="contained" sx={{ borderRadius: 16, minWidth: 42, fontSize: '0.75rem', py: 0.75 }}>Send</Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
