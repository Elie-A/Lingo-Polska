import presentFirstClass from "../data/lessons/present/present-tense-first-class.json";
import presentSecondClass from "../data/lessons/present/present-tense-second-class.json";
import presentThirdClass from "../data/lessons/present/present-tense-third-class.json";
import presentFourthClass from "../data/lessons/present/present-tense-fourth-class.json";
import presentVerbToBe from "../data/lessons/present/present-tense-verb-to-be.json";
import presentRandomVerbs from "../data/lessons/present/present-tense-random-verbs.json";

import pastTestMasculine from "../data/lessons/past/past-tesnse-masculine.json";
import pastTestFeminine from "../data/lessons/past/past-tesnse-feminine.json";

import futureTensePerfective from "../data/lessons/future/future-tense-perfective.json";
import futureTenseImperfectiveCompound from "../data/lessons/future/future-tense-imperfective-compound.json";
import futureTenseIrregular from "../data/lessons/future/future-tense-irregular.json";

import casesNominativePossessivePronouns from "../data/lessons/cases/nominative-possessive-pronouns.json";
import casesGenitiveCompleteTheSentences from "../data/lessons/cases/genitive-complete-the-sentences.json";
import casesGenitiveTranslateThePossessivePronouns from "../data/lessons/cases/genitive-translate-the-possessive-pronouns.json";
import dativeCompleteTheSentences from "../data/lessons/cases/dative-complete-the-sentences.json";
import accusativeCompleteTheSentences from "../data/lessons/cases/accusative-complete-the-sentences.json";
import nominativeCompleteTheSentences from "../data/lessons/cases/nominative-complete-the-sentences.json";

import grammarGenderExercisesRegularNouns from "../data/lessons/grammar/grammar-gender-exercises-regular-nouns.json";
import chooseGenderIrregularNouns from "../data/lessons/grammar/choose-gender-irregular-nouns.json";
import createPluralNounFormRegularNouns from "../data/lessons/grammar/create-plural-noun-form-regular-nouns.json";
import createPluralNounFormIrregularNouns from "../data/lessons/grammar/create-plural-noun-form-irregular-nouns.json";
import personalAndReflexivePronouns from "../data/lessons/grammar/personal-and-reflexive-pronouns.json";

import conditionalMix from "../data/lessons/conditional/conditional-mix.json";

import adverbsSelectCategory from "../data/lessons/adverbs/adverbs-select-category.json";
import adjectiveAdverbTransform from "../data/lessons/adverbs/adjective-adverb-tarnsform.json";
import adverbsComparative from "../data/lessons/adverbs/adverbs-comparative.json";
import adverbsIdentification from "../data/lessons/adverbs/adverbs-identification.json";
import adverbsDialogue from "../data/lessons/adverbs/adverbs-dialogue.json";
import adverbsCompleteWithVerbForms from "../data/lessons/adverbs/adverbs-complete-with-verb-forms.json";
import adverbsComparativeSuperlative from "../data/lessons/adverbs/adverbs-comparative-superlative.json";

const lessons = [
  {
    title: "Present Tense",
    description: "Instantly talk about daily life and current activities.",
    icon: "📝",
    path: "lessons/present",
    folder: "present",
    intro: `Welcome to the Present Tense lesson! Here, you'll explore the fundamentals of the present tense in Polish. 
You'll learn how to conjugate both regular and irregular verbs, describe your daily activities, and talk about actions happening right now or routines you perform regularly. 
Through practical examples, mini-dialogues, and exercises, you'll gain confidence in forming clear, grammatically correct sentences. 
By the end of this lesson, you'll be able to confidently describe your daily life, express your thoughts, and engage in simple conversations naturally and accurately.`,
    classes: [
      presentFirstClass,
      presentSecondClass,
      presentThirdClass,
      presentFourthClass,
      presentVerbToBe,
      presentRandomVerbs,
    ],
  },
  {
    title: "Past Tense",
    description: "Unlock the ability to share stories and recall memories.",
    icon: "⏰",
    path: "lessons/past",
    folder: "past",
    intro: `In the Past Tense lesson, you'll learn to narrate events and describe actions that have already happened in Polish. 
You'll discover how to conjugate regular and irregular verbs in the past tense, express completed actions, and tell simple stories about your day, past experiences, or historical events. 
Through exercises and practical examples, you'll gain the skills to communicate confidently and recount events naturally in Polish.`,
    classes: [pastTestMasculine, pastTestFeminine],
  },
  {
    title: "Future Tense",
    description: "Master the methods for discussing upcoming plans.",
    icon: "🚀",
    path: "lessons/future",
    folder: "future",
    intro: `The Future Tense lesson will teach you how to talk about actions and events that are going to happen. 
You'll learn the conjugation patterns for regular and irregular verbs, how to form future tense sentences, and how to discuss upcoming plans, intentions, and predictions. 
With clear examples and interactive exercises, you'll gain the ability to speak about the future with clarity and confidence in everyday conversations.`,
    classes: [
      futureTensePerfective,
      futureTenseImperfectiveCompound,
      futureTenseIrregular,
    ],
  },
  {
    title: "Conditional Tense",
    description:
      "Learn to express hypothetical situations, wishes, and polite requests in Polish.",
    icon: "🔮",
    path: "lessons/conditional",
    folder: "conditional",
    intro: `The Conditional Tense lesson will teach you how to talk about hypothetical scenarios, wishes, possibilities, and polite requests in Polish. 
You'll learn the formation of conditional sentences, how to conjugate verbs appropriately, and the nuances of expressing “would” and “could” in different contexts. 
With examples and exercises, you'll gain confidence in speaking about situations that are not real but imagined, enhancing your fluency and expressive range.`,
    classes: [conditionalMix],
  },
  {
    title: "Conjugation",
    description:
      "Decode the crucial rules and patterns to correctly inflect any Polish verb.",
    icon: "🔄",
    path: "lessons/conjugation",
    folder: "conjugation",
    intro: `In this lesson, you'll explore the essential rules of Polish verb conjugation. 
You'll learn how verbs change according to tense, person, and number, and understand the patterns behind both regular and irregular verbs. 
This foundational knowledge will allow you to form sentences correctly in any tense and build a strong grammatical base for all your Polish communication.`,
  },
  {
    title: "Cases",
    description:
      "Demystify the 7 Polish grammatical cases and learn how they change nouns, adjectives, and pronouns.",
    icon: "📚",
    path: "lessons/cases",
    folder: "cases",
    intro: `This lesson will guide you through the 7 grammatical cases in Polish, showing how they affect nouns, adjectives, pronouns, and sentence structure. 
You'll learn to identify cases, understand their rules, and apply them in practical contexts. 
By mastering cases, you'll be able to form correct sentences and communicate more naturally, gaining a deeper understanding of Polish grammar.`,
    classes: [
      casesNominativePossessivePronouns,
      casesGenitiveCompleteTheSentences,
      casesGenitiveTranslateThePossessivePronouns,
      dativeCompleteTheSentences,
      accusativeCompleteTheSentences,
      nominativeCompleteTheSentences,
    ],
  },
  {
    title: "Vocabulary",
    description:
      "Dramatically expand your practical Polish words and phrases for everyday conversations.",
    icon: "💬",
    path: "lessons/vocabulary",
    folder: "vocabulary",
    intro: `In the Vocabulary lesson, you'll acquire essential Polish words and phrases for daily life, travel, and social interactions. 
Through thematic lists, examples, and exercises, you'll learn how to use new words in context, improve your comprehension, and confidently express yourself in everyday situations. 
Building a strong vocabulary will allow you to communicate effectively and enrich your conversations in Polish.`,
  },
  {
    title: "Grammar & Gender",
    description:
      "Build a strong foundation by understanding sentence structure, noun genders, and core grammatical rules.",
    icon: "⚖️",
    path: "lessons/grammar",
    folder: "grammar",
    intro: `This lesson covers the essential principles of Polish grammar, including sentence structure, noun genders, adjective agreement, and key rules for constructing correct sentences. 
You'll gain a solid understanding of how words interact in a sentence and develop the ability to form grammatically accurate phrases. 
A strong grammar foundation will make learning verbs, cases, and more advanced topics much easier and more intuitive.`,
    classes: [
      grammarGenderExercisesRegularNouns,
      chooseGenderIrregularNouns,
      createPluralNounFormRegularNouns,
      createPluralNounFormIrregularNouns,
      personalAndReflexivePronouns,
    ],
  },
  {
    title: "Adverbs",
    description:
      "Learn how Polish adverbs work, how they are formed, and how to use them correctly to describe actions, intensity, manner, time, and frequency.",
    icon: "💥",
    path: "lessons/adverbs",
    folder: "adverbs",
    intro: `In this lesson, you will explore how Polish adverbs function within a sentence. 
You'll learn how to form adverbs from adjectives, how to modify verbs and other parts of speech, and how to express time, manner, degree, and frequency. 
Mastering adverbs will help you build more natural, fluent, and expressive sentences in Polish.`,
    classes: [
      adverbsSelectCategory,
      adjectiveAdverbTransform,
      adverbsComparative,
      adverbsIdentification,
      adverbsDialogue,
      adverbsCompleteWithVerbForms,
      adverbsComparativeSuperlative,
    ],
  },
  {
    title: "Practice",
    description:
      "Apply what you've learned with interactive exercises and real-life examples.",
    icon: "✍🏻",
    path: "lessons/practice",
    folder: "practice",
    intro: `The Practice lesson provides hands-on exercises, dialogues, and scenarios to help you apply what you've learned in previous lessons. 
You'll practice conjugating verbs, forming sentences, and using vocabulary in context, reinforcing your knowledge and building confidence. 
Through consistent practice, you'll improve both your comprehension and fluency, preparing you for real-life communication in Polish.`,
  },
  {
    title: "Polish Validator",
    description:
      "Instantly check your Polish text for grammar, vocabulary, and style accuracy, with AI-powered feedback tailored to your proficiency level.",
    icon: "🧠",
    path: "lessons/validator",
    folder: "validator",
    intro: `The Polish Validator lets you test your written Polish and receive detailed, level-appropriate feedback. 
You can select your proficiency or let the system auto-detect it, then analyze grammar, vocabulary, and sentence structure. 
This tool is designed to help you learn from your mistakes, refine your writing, and gain confidence in using Polish in real-life contexts.`,
  },
  {
    title: "References",
    description:
      "Access a curated list of external resources, dictionaries, and tools to continue your Polish learning journey.",
    icon: "🔗",
    path: "lessons/references",
    folder: "references",
    intro: `In the References lesson, you'll find a carefully curated collection of dictionaries, online resources, grammar guides, and learning tools to support your continued study of Polish. 
These resources will help you deepen your understanding, expand your vocabulary, and refine your skills, providing a roadmap for lifelong learning and practice beyond the course.`,
  },
];

export default lessons;
