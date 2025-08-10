// src/lib/dass21-questions.ts

export type Language = "fr" | "en" | "ar";

export const DASS21_QUESTIONS: Record<Language, string[]> = {
    fr: [
        "J'ai trouvé difficile de décompresser.",
        "J'ai été conscient(e) d’avoir la bouche sèche.",
        "J'ai eu l’impression de ne pas pouvoir ressentir d’émotion positive.",
        "J'ai eu de la difficulté à respirer (par exemple, respirations excessivement rapides, essoufflement sans effort physique).",
        "J'ai eu de la difficulté à initier de nouvelles activités.",
        "J'ai eu tendance à réagir de façon exagérée.",
        "J'ai eu des tremblements (par exemple, des mains).",
        "J'ai eu l’impression de dépenser beaucoup d’énergie nerveuse.",
        "Je me suis inquiété(e) en pensant à des situations où je pourrais paniquer et faire de moi un(e) idiot(e).",
        "J'ai eu le sentiment de ne rien envisager avec plaisir.",
        "Je me suis aperçu(e) que je devenais agité(e).",
        "J'ai eu de la difficulté à me détendre.",
        "Je me suis senti(e) abattu(e) et triste.",
        "J'ai été intolérant(e) à tout ce qui m’empêchait de faire ce que j’avais à faire.",
        "J'ai eu le sentiment d’être presque pris(e) de panique.",
        "J'ai été incapable de me sentir enthousiaste au sujet de quoi que ce soit.",
        "J'ai eu le sentiment de ne pas valoir grand chose comme personne.",
        "J'ai eu l’impression d’être assez susceptible.",
        "J'ai été conscient(e) des palpitations de mon coeur en l’absence d’effort physique (sensation d’augmentation de mon rythme cardiaque ou l’impression que mon cœur venait de sauter).",
        "J'ai eu peur sans bonne raison.",
        "J'ai eu l’impression que la vie n’avait pas de sens."
    ],
    en: [
        "I found it hard to wind down",
        "I was aware of dryness of my mouth",
        "I couldn’t seem to experience any positive feeling at all",
        "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)",
        "I found it difficult to work up the initiative to do things",
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
        "I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)",
        "I felt scared without any good reason",
        "I felt that life was meaningless"
    ],
    ar: [
        "وجدت صعوبة في الاسترخاء والراحة.",
        "شعرت بجفاف في حلقي.",
        "لم يبدو لي أن بإمكاني الإحساس بمشاعر إيجابية على الإطلاق.",
        "شعرت بصعوبة في التنفس (شدة التنفس السريع أو اللهاثان بدون القيام بمجهود جسدي مثلًا).",
        "وجدت صعوبة في أخذ المبادرة لعمل الأشياء.",
        "كنت أميل إلى ردة فعل مفرطة تجاه الظروف والأحداث.",
        "شعرت برجفة (باليدين مثلًا).",
        "شعرت بأنني أستهلك الكثير من طاقتي العصبية (شعرت بأنني أستهلك الكثير من قدرتي على تحمل التوتر العصبي).",
        "كنت خائفًا من مواقف قد أفقد فيها السيطرة على أعصابي وأسبب إحراجًا لنفسي.",
        "شعرت بأنه ليس لدي أي شيء أتطلع إليه.",
        "شعرت بأنني مضطرب ومنزعج.",
        "وجدت صعوبة في الاسترخاء.",
        "شعرت بالحزن والغم.",
        "لم أستطع تحمل أي شيء يحول بيني وبين ما أرغب في القيام به.",
        "شعرت بأنني على وشك الوقوع في حالة من الرعب المفاجئ بدون سبب.",
        "فقدت الشعور بالحماس لأي شيء.",
        "شعرت بأن قيمتي قليلة كشخص.",
        "شعرت بأنني أميل إلى الغيظ بسرعة.",
        "شعرت بضربات قلبي بدون مجهود جسدي (زيادة في معدل الدقات، أو غياب دقة قلب، مثلًا).",
        "شعرت بالخوف بدون أي سبب وجيه.",
        "شعرت بأن الحياة ليس لها معنى."
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
