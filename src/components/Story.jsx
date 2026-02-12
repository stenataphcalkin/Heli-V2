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
        response: "He's been so withdrawn since Uncle Joey passed. He barely comes out of his room, and when he does he just... snaps. Says things that feel really harsh. It's like I don't even recognize him anymore. I'm scared, and I don't know who else to ask.",
        nextStep: "positive_path"
      },
      {
        text: "We haven't spoken in ages, though. Why me?",
        response: "Because he actually respects you. You're not his parent, you're not preaching at him. When you two used to talk about stuff, he actually listened. Family's been trying but he just shuts us down. Maybe hearing from someone outside all this could help?",
        nextStep: "subtle_delay"
      },
      {
        text: "I'm swamped at work, maybe he just needs time to process?",
        response: "I thought so too at first. But it's been weeks now and he's getting worse, not better. He's not eating, sleeping weird hours... and the things he's said to us are so mean. I keep telling myself it's just grief, but something feels different. Wrong.",
        nextStep: "subtle_delay"
      },
      {
        text: "What if I mess this up and make it worse?",
        response: "Then at least you tried. That matters. Right now he feels alone, even with people around him. Knowing someone cares enough to reach out... that alone could change things.",
        nextStep: "address_doubt_about_harm"
      }
    ]
  },
  positive_path: {
    choices: [
      {
        text: "I'll visit him in person",
        response: "Thank you. He's at my parents' house. I really hope he'll actually talk to you.",
        nextStep: "positive_outcome"
      },
      {
        text: "Let me try calling or texting him first",
        response: "That works. He might be less defensive over text anyway.",
        nextStep: "positive_outcome"
      },
      {
        text: "What if he just pushes me away?",
        response: "Then at least he knows you tried. Just showing up matters - you don't have to solve everything. He needs to know someone's still watching.",
        nextStep: "reassurance_path"
      },
      {
        text: "Shouldn't a professional handle this?",
        response: "Eventually, yes. But friends matter too. You're not replacing therapy - you're just being someone who gives a damn. That has real value.",
        nextStep: "understand_role"
      }
    ]
  },
  subtle_delay: {
    choices: [
      {
        text: "What's been bothering him most?",
        response: "He's lost interest in everything. He won't see his friends anymore. And the way he talks... it's like he's angry at the world. He made this comment about how nobody actually cares about each other, and I realized - he might believe that about us too.",
        nextStep: "explore_warning_signs"
      },
      {
        text: "I'll wait a bit longer and see if he reaches out",
        response: "He won't. I've been waiting for him to come around and it just... isn't happening. If anything, he's getting quieter. I don't know how much longer I can watch this without doing something.",
        nextStep: "delayed_response_consequences"
      },
      {
        text: "Okay, I'll reach out tomorrow",
        response: "Really? Oh God, thank you. I know he might not open up right away, but at least... at least someone will have tried, you know? It means a lot.",
        nextStep: "positive_path"
      }
    ]
  },
  assess_duration: {
    choices: [
      {
        text: "This has been going on for weeks now",
        response: "Yeah... and it feels like every day he gets a little worse. I keep hoping I'm overreacting, but I'm not, am I? This is actually really bad.",
        nextStep: "recognize_pattern_action"
      },
      {
        text: "Maybe I should wait a bit longer?",
        response: "I don't think that's... I'm sorry, I can't wait anymore. Every day he seems further away. I'm terrified if we don't do something now, we'll lose him.",
        nextStep: "consequence_of_waiting"
      },
      {
        text: "He's probably just grieving - that takes time",
        response: "I get that. But he's not just sad, you know? It's like he's... shutting down. The eating, the sleeping all weird hours, the way he talks... I've never seen grief look like this before.",
        nextStep: "grief_education"
      },
      {
        text: "I don't want to pry into his business",
        response: "I get it. But this isn't about control - this is about keeping him safe. Sometimes caring about someone means checking in even if they push back.",
        nextStep: "privacy_vs_care"
      }
    ]
  },
  recognize_communication_changes: {
    choices: [
      {
        text: "He's stopped talking to people",
        response: "Exactly. He used to call me about stupid stuff all the time. Now? Nothing. And when I try to reach him, I get one-word answers or just silence. It's like he's shutting us out.",
        nextStep: "positive_path"
      },
      {
        text: "How are his sleep and eating?",
        response: "That's the thing that really worries me. He's up at weird hours - I hear him in his room at 3 AM. And he barely eats. When I bring food to his room, he leaves it. I'm worried he's wasting away.",
        nextStep: "physical_warning_signs"
      },
      {
        text: "What do you mean he's become cruel?",
        response: "He's not the kid I grew up with. He's cutting, judgmental about everything. He said something to our dad that was just... designed to hurt. I've never heard him like this. Maybe it's just anger because of the grief, but it feels personal somehow.",
        nextStep: "personality_change_discussion"
      },
      {
        text: "Teenagers can be moody though",
        response: "He's not just moody. Moody is complaining about chores. This is... it's darker than that. The things he says feel designed to hurt us. And the way he looks at people - like he's disgusted with them. With us.",
        nextStep: "dismissive_response_consequence"
      },
      {
        text: "Maybe he just needs space from everyone right now",
        response: "Space doesn't help when someone's spiraling. Isolation just makes you feel more buried. He needs to know someone's still there, even if he's pushing everyone away.",
        nextStep: "impact_of_reaching_out"
      },
      {
        text: "What if he tells me to back off?",
        response: "He probably will. But that doesn't mean he doesn't need this. Sometimes people push the hardest when they need help the most. At least he'll know you didn't give up on him.",
        nextStep: "handling_pushback"
      }
    ]
  },
  physical_warning_signs: {
    choices: [
      {
        text: "The sleep and appetite changes worry me",
        response: "Right? I keep thinking maybe it's just the grief, but three weeks? And only getting worse? I'm terrified this means something deeper is wrong.",
        nextStep: "educational_moment"
      },
      {
        text: "He definitely needs help - not just time",
        response: "That's what I needed to hear. I've been so scared I was pushing him, but you're right. Waiting isn't going to fix this.",
        nextStep: "positive_path"
      },
      {
        text: "But maybe he just needs time to process?",
        response: "Time helps when you're healing. But this isn't healing - he's disappearing. There's a difference between grief and... whatever this is.",
        nextStep: "space_vs_isolation"
      },
      {
        text: "I don't know how to actually help him though",
        response: "You don't have to fix it alone. Just letting him know you see him and you care - that matters more than you think. And if he needs real help, you can find that together.",
        nextStep: "support_role_clarity"
      }
    ]
  },
  explore_warning_signs: {
    choices: [
      {
        text: "How long has he been like this?",
        response: "Three weeks. Maybe longer? At first I thought it was just grief, but it's only gotten worse. Every day he withdraws a little more.",
        nextStep: "assess_duration"
      },
      {
        text: "Has he talked about how he's feeling?",
        response: "That's the worst part - he won't. Just keeps saying 'I'm fine' while everything else screams that he's not. He can't even make eye contact anymore.",
        nextStep: "recognize_communication_changes"
      },
      {
        text: "You said he's been cruel to your family?",
        response: "Yeah. He told Mom she was suffocating. Told Dad he doesn't understand anything. It wasn't teenage attitude - it was calculated to hurt. That's not who he is. Or... wasn't.",
        nextStep: "personality_change_discussion"
      },
      {
        text: "This feels serious - I think we should reach out",
        response: "Really? You don't think I'm overreacting? God, thank you for saying that. I needed someone to take this seriously.",
        nextStep: "positive_path"
      },
      {
        text: "I'm not sure how to read all of this",
        response: "I just know it's not one thing. It's everything changing at once - sleep, food, friends, the way he talks. It's the whole picture that scares me.",
        nextStep: "learn_warning_signs"
      }
    ]
  },
  recognize_pattern_action: {
    choices: [
      {
        text: "Let's reach out together - what do you need from me?",
        response: "Maybe you could text him? Just check in? He might actually respond to you since you're not family. He might not feel as defensive.",
        nextStep: "positive_path"
      },
      {
        text: "Are there other things I should pay attention to?",
        response: "Sometimes people start giving things away or say they feel like a burden. I haven't seen that yet. But the isolation mixed with everything else? That's already more than enough to worry me.",
        nextStep: "educational_moment"
      }
    ]
  },
  educational_moment: {
    choices: [
      {
        text: "Taken together, this feels like we should act now",
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
        text: "That's a massive personality shift - something's really wrong",
        response: "That's what I've been thinking. He's never been like this. It's like he hates us or hates himself. I can't tell which is scarier.",
        nextStep: "understand_personality_changes"
      },
      {
        text: "Can you give me examples?",
        response: "Yesterday he told my mom she was being pathetic for crying. He said my dad was weak. But the worst part? He said it calmly, like he meant every word. Like he wanted to hurt them.",
        nextStep: "hostile_behavior_details"
      },
      {
        text: "Angry grief doesn't make people that cruel though",
        response: "You're right. Anger and grief made him moody, sure. But this calculated cruelty? Knowing exactly what will shatter someone? That's different. That scares me.",
        nextStep: "distinguish_anger_from_hostility"
      },
      {
        text: "He's in real distress - you should reach out",
        response: "I think you're right. I was worried I'd make it worse, but... I think he's worse because nobody's reaching out. I need to try.",
        nextStep: "positive_path"
      }
    ]
  },
  understand_personality_changes: {
    choices: [
      {
        text: "Grief doesn't cause this much cruelty on its own",
        response: "So he's not just grieving? That helps me understand why I felt so panicked. Something else is happening with him.",
        nextStep: "connect_symptoms"
      },
      {
        text: "If he keeps going like this, he'll damage everything",
        response: "I know. And that's the terrifying part - I think he knows too. But he can't seem to stop. I need to help him before he destroys himself.",
        nextStep: "positive_path"
      }
    ]
  },
  hostile_behavior_details: {
    choices: [
      {
        text: "Grief is one thing - intentional cruelty is something else",
        response: "I'm so glad you understand. Everyone keeps saying 'give him time, he's grieving' but this doesn't feel like grief. This feels urgent.",
        nextStep: "positive_path"
      },
      {
        text: "It sounds like he's deliberately driving people away",
        response: "Yes. Which is what terrifies me. If he pushes everyone away, who's going to be there when he really needs someone?",
        nextStep: "understand_pushing_away"
      }
    ]
  },
  distinguish_anger_from_hostility: {
    choices: [
      {
        text: "This is actually grief expressing itself as anger - common reaction",
        response: "So he's acting out to protect himself? I never thought of it that way. He's hurt and he doesn't know how to handle it.",
        nextStep: "positive_path"
      },
      {
        text: "People hurt others when they're hurting themselves",
        response: "Oh God. So he's not being cruel because he's a bad person - he's being cruel because he's in pain? That makes it worse somehow. I need to reach out to him.",
        nextStep: "psychology_of_pushing_away"
      }
    ]
  },
  connect_symptoms: {
    choices: [
      {
        text: "Yes - it's all pointing to the same bigger problem",
        response: "That makes sense. So it's not separate issues - it's all one big signal that he needs help.",
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
        text: "You're right - time is important here",
        response: "Thank you for understanding. I knew coming to you would help me find clarity. Let's do this.",
        nextStep: "positive_path"
      },
      {
        text: "What if we wait a bit longer?",
        response: "I want to believe that, but the feeling in my gut... I can't shake it. Every day he seems to get worse, and I'm scared if we wait too long, it'll be too late.",
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
        text: "Actually, I think you know him better than anyone",
        response: "Right? And my gut has been screaming for weeks. I'm tired of second-guessing myself. I need to listen to what I'm seeing.",
        nextStep: "positive_path"
      },
      {
        text: "Maybe he'll snap out of it on his own",
        response: "I hope so... I really do. But I have this feeling that if I don't do something, this is going to get a lot worse. I guess I'll just have to wait and see.",
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
        text: "Check in on Lazlo a week later",
        response: "Lilly: He's... he's not going to school. His teacher called yesterday. I kept waiting and hoping he'd get better on his own, but now it's worse. I should have listened to my instincts sooner.",
        nextStep: "learn_from_delay"
      },
      {
        text: "Actually, let's reach out to him right now",
        response: "Really? Thank God. I've been so scared – I was just looking for permission to do what I already knew I needed to do. Let's help him.",
        nextStep: "explore_warning_signs"
      }
    ]
  },
  late_intervention_path: {
    choices: [
      {
        text: "Reach out to Lazlo now, even if we waited too long",
        response: "He finally opened up... He said he felt invisible. Like nobody was watching, nobody cared. We could have reached him sooner, but at least he knows we're here now.",
        nextStep: "story_end_lesson"
      },
      {
        text: "What should we have paid attention to?",
        response: "Everything you saw: the pulling away, the changes in how he takes care of himself, the new cruelty, the way he talks about himself. You were picking up real signals. The big clue is when multiple things change at once - not just one bad day, but a pattern.",
        nextStep: "educational_reflection"
      }
    ]
  },
  educational_reflection: {
    choices: [
      {
        text: "So I need to trust what I'm seeing and act",
        response: "Yes. Next time - and there might be someone in your life this will matter for - don't wait for perfect certainty. If multiple changes are there and they're not getting better, reach out. You don't have to be right, you just have to care.",
        nextStep: "story_end_lesson"
      },
      {
        text: "Let me start over with what I know now",
        response: "Good idea. Imagine I'm reaching out to you again for the first time, but now you understand the pattern. What would you do differently?",
        nextStep: "subtle_delay"
      }
    ]
  },
  early_help_positive: {
    choices: [
      {
        text: "What made the difference in reaching out early?",
        response: "You took what you were seeing seriously, you asked questions instead of dismissing concerns, and you acted quickly. That's what helped Lazlo feel seen and supported when he needed it most.",
        nextStep: "story_end_good"
      }
    ]
  },
  address_doubt_about_harm: {
    choices: [
      {
        text: "But what if I make things worse by bringing it up?",
        response: "You won't. Silence makes things worse - it makes people feel more alone. Even if he pushes back at first, knowing you care is powerful.",
        nextStep: "positive_path"
      },
      {
        text: "What do I even say to him?",
        response: "Something real. Like: 'Hey, I've noticed you seem really down lately. Even if you're not ready to talk, I want you to know I'm here.' You don't need perfect words - you need sincerity.",
        nextStep: "communication_guidance"
      },
      {
        text: "I'm nervous I'll mess this up",
        response: "That's actually a good sign - it means you care. The fact that you want to get it right shows him you're taking this seriously. That matters.",
        nextStep: "practice_conversation"
      }
    ]
  },
  reassurance_path: {
    choices: [
      {
        text: "I'm going to reach out despite being scared",
        response: "That's exactly what courage looks like. Being scared and doing it anyway. Lazlo needs that right now.",
        nextStep: "positive_outcome"
      },
      {
        text: "What if he pushes me away?",
        response: "He probably will, at least at first. But that doesn't mean it didn't matter that you tried. Sometimes people need to hear it multiple times before they believe anyone actually cares.",
        nextStep: "conversation_expectations"
      }
    ]
  },
  understand_role: {
    choices: [
      {
        text: "So I'm not supposed to solve everything?",
        response: "Not at all. You're just being there. If he needs real help, you encourage him to get it - therapy, doctors, whatever. But being heard by someone who cares? That's huge.",
        nextStep: "positive_outcome"
      },
      {
        text: "I can do that - just be there and listen",
        response: "You can. And honestly? That might be enough to change everything for him. It's not nothing.",
        nextStep: "positive_outcome"
      }
    ]
  },
  learn_warning_signs: {
    choices: [
      {
        text: "So it's the pattern that matters, not one thing",
        response: "Exactly. Anyone can have a bad day with sleep or appetite. But when everything changes together for weeks? That's worth paying attention to.",
        nextStep: "positive_path"
      },
      {
        text: "What else should I pay attention to in the future?",
        response: "In Lazlo's case, the hostility mixed with withdrawal is really telling. Sometimes people also give things away, talk about being a burden, or get stuck in negative thinking. But what matters is understanding their whole picture.",
        nextStep: "educational_moment"
      }
    ]
  },
  grief_education: {
    choices: [
      {
        text: "It's starting to make sense. He needs help, not time",
        response: "Right. Time helps, but not when someone is actively getting worse. That's when you need to step in.",
        nextStep: "positive_path"
      },
      {
        text: "When does grief stop being normal?",
        response: "When someone can't do basic things - eat, sleep, get out of bed. When they want to hurt themselves or others. That's when grief has become a crisis and needs real intervention.",
        nextStep: "recognize_pattern_action"
      }
    ]
  },
  privacy_vs_care: {
    choices: [
      {
        text: "Asking if someone's okay isn't an invasion",
        response: "That's right. Caring isn't the same as prying. You're allowed to notice when someone you care about is hurting.",
        nextStep: "positive_path"
      },
      {
        text: "I'm worried I'll embarrass him by bringing it up",
        response: "Maybe for a moment. But which is worse - brief embarrassment, or spiraling alone wondering if anybody cares? I know which I'd choose if I was drowning.",
        nextStep: "consequence_of_waiting"
      }
    ]
  },
  impact_of_reaching_out: {
    choices: [
      {
        text: "Even awkward is better than alone",
        response: "Exactly. And sometimes the awkward conversation is the one that saves someone. He needs to hear that he hasn't been forgotten.",
        nextStep: "positive_path"
      },
      {
        text: "How do I start that conversation?",
        response: "Keep it simple. 'Hey, I've been thinking about you. You've seemed really down lately and I'm worried. I'm here if you want to talk.' That's it. Don't overthink.",
        nextStep: "communication_guidance"
      }
    ]
  },
  handling_pushback: {
    choices: [
      {
        text: "Even if he tells me to go away, I should still try?",
        response: "Yes. You can say 'Alright, but I'm here if you change your mind.' Don't disappear just because he said to the first time. Persistence matters.",
        nextStep: "positive_path"
      },
      {
        text: "What if he gets angry and takes it out on me?",
        response: "He might. And it'll hurt. But his anger isn't really about you - it's about his pain. Can you hold space for that? For him?",
        nextStep: "courage_to_act"
      }
    ]
  },
  space_vs_isolation: {
    choices: [
      {
        text: "This is isolation, not healthy coping",
        response: "Yes. And isolation kills people slowly. He needs to know someone is still reaching, even if he's not ready to reach back yet.",
        nextStep: "positive_path"
      },
      {
        text: "How can I tell if someone needs space or intervention?",
        response: "If they're still taking care of themselves and connecting with a few people, they're coping. If everything shuts down at once - eating, sleep, friendships, self-care - that's not space. That's a real shift.",
        nextStep: "educational_moment"
      }
    ]
  },
  support_role_clarity: {
    choices: [
      {
        text: "I don't have to fix everything - just show up",
        response: "Exactly. Listen. Be there. If he needs professional help, you support him in finding it. But showing up matters - it's not nothing.",
        nextStep: "positive_outcome"
      },
      {
        text: "That helps. I can be there without having all the answers",
        response: "Good. You don't have to fix him - just show up. That's enough.",
        nextStep: "positive_outcome"
      }
    ]
  },
  communication_guidance: {
    choices: [
      {
        text: "I can say that. Simple is better anyway",
        response: "Much better. Authenticity beats rehearsed every time. He needs real, not perfect.",
        nextStep: "positive_outcome"
      },
      {
        text: "What if he says 'I'm fine' but I know he's not?",
        response: "Then you say something like 'I've noticed you're up at 3 AM and not eating. That's not fine.' Be specific about what you've seen. Hard to argue with reality.",
        nextStep: "positive_outcome"
      }
    ]
  },
  conversation_expectations: {
    choices: [
      {
        text: "Even a messy attempt matters",
        response: "More than you know. People remember who showed up, not who said the perfect thing.",
        nextStep: "positive_outcome"
      },
      {
        text: "Okay. I'm going to reach out now",
        response: "Good. Being willing to feel uncomfortable for someone else's sake - that's what love looks like.",
        nextStep: "positive_outcome"
      }
    ]
  },
  courage_to_act: {
    choices: [
      {
        text: "Yes. I'll reach out today",
        response: "Good. That's the bravery he needs from you right now. Let's help him.",
        nextStep: "positive_outcome"
      },
      {
        text: "I need a day to think about how to say this",
        response: "I get it - this is hard. But every day that passes, he's alone with his thoughts a little longer. Can you push through the fear and reach out today?",
        nextStep: "reflection_on_action"
      }
    ]
  },
  practice_conversation: {
    choices: [
      {
        text: "Let me practice what I'll say",
        response: "Sure. Start with 'You haven't seemed like yourself lately' then ask 'What's going on with you?' Keep it open so he has space to answer honestly.",
        nextStep: "communication_guidance"
      },
      {
        text: "Actually, I'm ready. Let's do this",
        response: "Perfect. You care about him - that'll come through in whatever you say.",
        nextStep: "positive_outcome"
      }
    ]
  },
  signs_overlooked: {
    choices: [
      {
        text: "Wait a week and check in again",
        response: "He stopped going to school. His guidance counselor called. He told her he doesn't see the point anymore. I waited too long. I wish I'd listened to you the first time.",
        nextStep: "late_realization"
      },
      {
        text: "Actually, I should check in sooner",
        response: "Oh thank God. I was about to call you again - I can't stop thinking about him. I'm really scared.",
        nextStep: "subtle_delay"
      }
    ]
  },
  late_realization: {
    choices: [
      {
        text: "Reach out to Lazlo despite the delay",
        response: "He's... willing to talk. He said he's been feeling invisible. Like he could disappear and nobody would notice until it was too late. We can help him now, but it would have been easier if we'd moved faster.",
        nextStep: "story_end_lesson"
      },
      {
        text: "What could I have seen earlier?",
        response: "All the changes were there from the start: isolation, physical symptoms, cruelty, personality change. I wish I'd understood what they meant together. Can we go back and look at this again?",
        nextStep: "reflection_loop"
      }
    ]
  },
  reflection_loop: {
    choices: [
      {
        text: "Let me try this again from the beginning",
        response: "Okay. Imagine I'm reaching out for the first time again. Now you know what the pattern means.",
        nextStep: "subtle_delay"
      },
      {
        text: "I understand the lesson. Move forward",
        response: "Yeah. Waiting cost us time we can't get back. At least now I know: when you see the pattern, you act. You don't wait for it to get worse.",
        nextStep: "story_end_lesson"
      }
    ]
  },
  positive_outcome: {
    choices: [
      {
        text: "How did early action help Lazlo?",
        response: "He said later that knowing someone noticed - that someone cared enough to reach out when things got dark - that was what gave him hope. Your timing mattered. Moving fast meant he didn't have to suffer alone as long.",
        nextStep: "story_end_good"
      }
    ]
  },
  story_end_good: {
    choices: [
      {
        text: "What made the difference here?",
        response: "You saw the changes. You asked real questions. You acted quickly instead of waiting. Those three things together - that's how you help someone who's drowning.\n\nLazlo got help early because you didn't ignore what you were seeing.",
        nextStep: "final_restart"
      }
    ]
  },
  story_end_lesson: {
    choices: [
      {
        text: "What should I have done differently?",
        response: "The changes were all there: isolation, physical changes, cruelty, personality shift. When multiple things shift together, you act - you don't wait to see if it gets worse.\n\nYou helped eventually. But sooner is always better than later.",
        nextStep: "final_restart"
      }
    ]
  },
  final_restart: {
    choices: [
      {
        text: "Start Over",
        response: "",
        nextStep: "start"
      },
      {
        text: "Try the scenario again with what I learned",
        response: "Okay. Let's go through it again. This time you'll recognize the pattern earlier.",
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
                <Box sx={{ display: 'flex', gap: '0.5px', alignItems: 'flex-end', height: '7px' }}>
                  <Box sx={{ width: '3px', height: '4px', bgcolor: '#fff' }} />
                  <Box sx={{ width: '3px', height: '5px', bgcolor: '#fff' }} />
                  <Box sx={{ width: '3px', height: '6px', bgcolor: '#fff' }} />
                  <Box sx={{ width: '3px', height: '7px', bgcolor: '#fff' }} />
                </Box>
                
                {/* WiFi symbol */}
                <Box sx={{ width: '7px', height: '7px', position: 'relative' }}>
                  <Box sx={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '2px', height: '2px', bgcolor: '#fff', borderRadius: '50%' }} />
                  <Box sx={{ position: 'absolute', bottom: '1px', left: '50%', transform: 'translateX(-50%)', width: '5px', height: '5px', border: '0.5px solid #fff', borderRadius: '50%', borderTop: 'none', borderLeft: 'none' }} />
                </Box>
                
                {/* Message/SMS icon */}
                <Box sx={{ width: '7px', height: '6px', border: '0.5px solid #fff', borderRadius: '0.5px', position: 'relative' }}>
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
