// src/lib/dass21-questions.ts

export const DASS21_QUESTIONS: Record<"fr" | "en" | "ar", string[]> = {
    fr: [
        "J'ai eu du mal à me calmer.",
        "J'ai eu la bouche sèche.",
        "Je n'ai eu aucun sentiment positif.",
        "J'ai eu du mal à respirer (par exemple, une respiration excessivement rapide, un essoufflement en l'absence d'effort physique).",
        "J'ai eu du mal à prendre des initiatives.",
        "J'ai eu tendance à réagir de façon excessive aux situations.",
        "J'ai eu des tremblements (par exemple, dans les mains).",
        "J'ai eu l'impression de dépenser beaucoup d'énergie nerveuse.",
        "Je me suis inquiété(e) de situations où je pourrais paniquer et me ridiculiser.",
        "J'ai eu l'impression de n'avoir rien à espérer.",
        "Je me suis senti(e) agité(e).",
        "J'ai eu du mal à me détendre.",
        "Je me suis senti(e) triste et abattu(e).",
        "Je n'ai pas toléré que quelque chose m'empêche de continuer ce que je faisais.",
        "J'ai eu l'impression d'être sur le point de paniquer.",
        "Rien ne m'a enthousiasmé(e).",
        "J'ai eu le sentiment de ne pas valoir grand-chose en tant que personne.",
        "J'ai eu l'impression d'être assez susceptible.",
        "J'ai été conscient(e) des battements de mon cœur en l'absence d'effort physique (par exemple, sensation d'augmentation du rythme cardiaque, d'irrégularité des battements).",
        "J'ai eu peur sans raison.",
        "J'ai eu l'impression que la vie ne valait pas la peine d'être vécue."
    ],
    en: [
        "I found it hard to wind down.",
        "I was aware of dryness of my mouth.",
        "I couldn’t seem to experience any positive feeling at all.",
        "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion).",
        "I found it difficult to work up the initiative to do things.",
        "I tended to over-react to situations.",
        "I experienced trembling (e.g. in the hands).",
        "I felt that I was using a lot of nervous energy.",
        "I was worried about situations in which I might panic and make a fool of myself.",
        "I felt that I had nothing to look forward to.",
        "I found myself getting agitated.",
        "I found it difficult to relax.",
        "I felt down-hearted and blue.",
        "I was intolerant of anything that kept me from getting on with what I was doing.",
        "I felt I was close to panic.",
        "I was unable to become enthusiastic about anything.",
        "I felt I wasn’t worth much as a person.",
        "I felt that I was rather touchy.",
        "I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat).",
        "I felt scared without any good reason.",
        "I felt that life was meaningless."
    ],
    ar: [
        "وجدت صعوبة في الاسترخاء والهدوء.",
        "كنت على وعي بجفاف فمي.",
        "لم أشعر بأي شعور إيجابي على الإطلاق.",
        "واجهت صعوبة في التنفس (مثل التنفس السريع بشكل مفرط، أو ضيق التنفس في غياب مجهود بدني).",
        "وجدت صعوبة في حث نفسي على القيام بالأشياء.",
        "كنت أميل إلى المبالغة في رد الفعل تجاه المواقف.",
        "عانيت من الرعشة (مثلاً، في اليدين).",
        "شعرت بأنني أستهلك الكثير من الطاقة العصبية.",
        "كنت قلقًا بشأن المواقف التي قد أصاب فيها بالذعر وأعرض نفسي للسخرية.",
        "شعرت بأنه لا يوجد شيء أتطلع إليه.",
        "وجدت نفسي أشعر بالهياج.",
        "وجدت صعوبة في الاسترخاء.",
        "شعرت بالإحباط والكآبة.",
        "لم أكن أتحمل أي شيء يمنعني من مواصلة ما أفعله.",
        "شعرت بأنني على وشك الإصابة بالذعر.",
        "لم أتمكن من الشعور بالحماس تجاه أي شيء.",
        "شعرت بأنني لا أساوي الكثير كشخص.",
        "شعرت بأنني كنت سريع الانفعال إلى حد ما.",
        "كنت على وعي بنبضات قلبي في غياب مجهود بدني (مثل الإحساس بزيادة معدل ضربات القلب، أو عدم انتظامها).",
        "شعرت بالخوف دون سبب وجيه.",
        "شعرت بأن الحياة لا معنى لها."
    ]
};

export const DASS21_LABELS: Record<"fr" | "en" | "ar", {
    question: string;
    of: string;
    option0: string;
    option1: string;
    option2: string;
    option3: string;
}> = {
    fr: {
        question: "Question",
        of: "sur",
        option0: "Ne s'applique pas du tout à moi.",
        option1: "S'applique un peu à moi, ou une partie du temps.",
        option2: "S'applique assez à moi, ou une bonne partie du temps.",
        option3: "S'applique beaucoup à moi, ou la plupart du temps."
    },
    en: {
        question: "Question",
        of: "of",
        option0: "Did not apply to me at all.",
        option1: "Applied to me to some degree, or some of the time.",
        option2: "Applied to me to a considerable degree, or a good part of time.",
        option3: "Applied to me very much, or most of the time."
    },
    ar: {
        question: "سؤال",
        of: "من",
        option0: "لم ينطبق عليّ إطلاقًا.",
        option1: "انطبق عليّ إلى حد ما، أو في بعض الأحيان.",
        option2: "انطبق عليّ إلى درجة كبيرة، أو في جزء كبير من الوقت.",
        option3: "انطبق عليّ كثيرًا، أو في معظم الأحيان."
    }
};
