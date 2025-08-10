// src/lib/dass21-questions.ts

export type Language = "fr" | "en" | "ar";

export const DASS21_QUESTIONS: Record<Language, string[]> = {
    fr: [
        "J'ai trouvé difficile de décompresser",
        "J'ai eu la bouche sèche",
        "Je n'ai pas pu ressentir d'émotion positive",
        "J'ai eu des difficultés à respirer (p. ex. essoufflement sans effort)",
        "J'ai eu du mal à prendre des initiatives",
        "J'ai réagi de façon exagérée",
        "J'ai eu des tremblements (p. ex. aux mains)",
        "J'ai eu l'impression de dépenser beaucoup d'énergie nerveuse",
        "J'ai eu peur de paniquer et de paraître idiot",
        "Je n'avais rien à attendre avec plaisir",
        "Je devenais agité",
        "J'ai eu du mal à me détendre",
        "Je me suis senti abattu et triste",
        "J'étais intolérant à toute interruption",
        "J'ai eu l'impression d'être presque en panique",
        "Je n'ai eu d'enthousiasme pour quoi que ce soit",
        "J'ai eu le sentiment de ne pas valoir grand-chose",
        "J'étais assez susceptible",
        "J'étais conscient des battements de mon cœur sans effort",
        "J'ai eu peur sans raison",
        "J'ai eu l'impression que ma vie n'avait pas de sens"
    ],
    en: [
        "I found it hard to wind down",
        "I was aware of dryness of my mouth",
        "I couldn’t experience any positive feeling",
        "I experienced breathing difficulty (e.g. breathlessness without exertion)",
        "I found it difficult to work up initiative",
        "I tended to over-react to situations",
        "I experienced trembling (e.g. in the hands)",
        "I felt that I was using a lot of nervous energy",
        "I was worried about situations in which I might panic and make a fool of myself",
        "I felt that I had nothing to look forward to",
        "I found myself getting agitated",
        "I found it difficult to relax",
        "I felt down-hearted and blue",
        "I was intolerant of anything that kept me from getting on with what I was doing",
        "I felt I was close to panic",
        "I was unable to become enthusiastic about anything",
        "I felt I wasn’t worth much as a person",
        "I felt that I was rather touchy",
        "I was aware of the action of my heart in the absence of physical exertion",
        "I felt scared without any good reason",
        "I felt that life was meaningless"
    ],
    ar: [
        "وجدت صعوبة في الاسترخاء",
        "شعرت بجفاف في حلقي",
        "لم أستطع الإحساس بمشاعر إيجابية",
        "صعوبة في التنفس (مثل اللهث دون جهد)",
        "صعوبة في بدء الأنشطة",
        "بالغت في رد الفعل",
        "شعرت برجفة (مثلاً باليدين)",
        "استهلكت الكثير من الطاقة العصبية",
        "خفت من مواقف قد أفقد فيها السيطرة وأحرج نفسي",
        "لا يوجد ما أتطلع إليه",
        "شعرت بالاضطراب والانزعاج",
        "وجدت صعوبة في الاسترخاء",
        "شعرت بالحزن والغم",
        "لم أتحمل أي شيء يعطلني",
        "شعرت بأنني على وشك الذعر",
        "فقدت الحماس لأي شيء",
        "شعرت بأن قيمتي قليلة كشخص",
        "أصبحت سريع الغضب",
        "شعرت بضربات قلبي بدون جهد",
        "شعرت بالخوف بدون سبب",
        "شعرت بأن الحياة بلا معنى"
    ]
};

export const DASS21_LABELS: Record<Language, {
    question: string;
    of: string;
    option0: string;
    option1: string;
    option2: string;
    option3: string;
    back: string;
}> = {
    fr: {
        question: "Question",
        of: "sur",
        option0: "Ne s'applique pas du tout à moi.",
        option1: "S'applique un peu à moi, ou une partie du temps.",
        option2: "S'applique assez à moi, ou une bonne partie du temps.",
        option3: "S'applique beaucoup à moi, ou la plupart du temps.",
        back: "Retour"
    },
    en: {
        question: "Question",
        of: "of",
        option0: "Did not apply to me at all.",
        option1: "Applied to me to some degree, or some of the time.",
        option2: "Applied to me to a considerable degree, or a good part of time.",
        option3: "Applied to me very much, or most of the time.",
        back: "Back"
    },
    ar: {
        question: "سؤال",
        of: "من",
        option0: "لم ينطبق عليّ إطلاقًا.",
        option1: "انطبق عليّ إلى حد ما، أو في بعض الأحيان.",
        option2: "انطبق عليّ إلى درجة كبيرة، أو في جزء كبير من الوقت.",
        option3: "انطبق عليّ كثيرًا، أو في معظم الأحيان.",
        back: "رجوع"
    }
};
