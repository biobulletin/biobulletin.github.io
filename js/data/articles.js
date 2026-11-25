/* =========================================================
   ARTICLES — the club's reading list. The only file you need
   to edit to add an article the club has picked.

   HOW TO ADD AN ARTICLE
   1. Copy one { ... } block below and paste it at the TOP of the list.
   2. Change every field:
        id        unique, lowercase, dashes instead of spaces
                  (it becomes the web address)
        title     the article's title
        author    who ORIGINALLY wrote it
        source    (optional) where it was published, e.g. "BBC Science Focus"
        link      (optional) web address of the original, starting https://
        date      "YYYY-MM-DD", when the club read it (newest shows first)
        category  one of the names in CATEGORIES
        emoji     shown on the card
        excerpt   one-sentence teaser
   3. Write the body between the ` backticks:
        - Leave an empty line between paragraphs
        - ## at the start of a line   → a sub-heading
        - > at the start of a line    → a highlighted "fun fact" box
        - **like this**               → bold
   Reading time is calculated automatically.

   ABOUT OTHER PEOPLE'S ARTICLES
   Copying a whole article from another website onto ours usually
   needs the writer's permission. Safer options: write a short summary
   in the club's own words and use `link` to send readers to the
   original, or only use articles that allow sharing (some say so,
   e.g. "Creative Commons"). Either way, keep author/source so the
   writer gets the credit.

   The four articles below are SAMPLES — replace them with the
   club's real picks.
   ========================================================= */

export const CATEGORIES = {
  Physics:     { emoji: "⚛️", color: "teal" },
  Biology:     { emoji: "🧬", color: "sage" },
  Medicine:    { emoji: "🩺", color: "blush" },
  Chemistry:   { emoji: "🧪", color: "blush" },
  Maths:       { emoji: "📐", color: "vanilla" },
  Technology:  { emoji: "💻", color: "rose" },
  Engineering: { emoji: "⚙️", color: "sand" },
};

export const ARTICLES = [
  {
    id: "how-vaccines-teach-your-body-to-fight",
    title: "How Vaccines Teach Your Body to Fight",
    author: "BioBulletin",
    date: "2026-11-26",
    category: "Medicine",
    emoji: "💉",
    excerpt: "A vaccine is a practice run for your immune system. Here's how a harmless preview of a germ can protect you for years.",
    body: `
Think about a fire drill at school. Nobody is in danger, but everyone learns where the exits are, so if a real fire ever happens, you know exactly what to do. A vaccine works the same way: it is a **fire drill for your immune system**.

## Meet your immune system

Germs that cause disease, like viruses and bacteria, are called **pathogens**. Every pathogen carries special molecules on its surface called **antigens**. You can think of an antigen as a name badge: it tells your body exactly which germ it is dealing with.

Your immune system is an army of white blood cells. Two kinds matter most here. **B cells** make **antibodies**, Y-shaped proteins that latch onto one specific antigen. An antibody can block a germ from getting into your cells, or mark it so other immune cells destroy it. **T cells** do two jobs: some coordinate the attack, and others destroy your own cells that have already been infected.

There is a catch. The first time your body meets a new germ, it has to find the few B cells and T cells that match that germ's name badge, and then copy them millions of times. That can take a week or more. Meanwhile, the germ is multiplying too, and that is when you feel ill.

## The secret weapon: memory

After an infection, some of those matching B cells and T cells stay behind as **memory cells**. Some of them can last for decades. If the same germ ever returns, the memory cells recognise its name badge straight away and launch a fast, powerful attack, often before you notice any symptoms at all. That is why most people only catch chickenpox once.

But getting memory cells the natural way has a big downside: you have to catch the disease first. Some diseases can cause serious harm, or even kill, before the immune system catches up.

## So what is actually in a vaccine?

A vaccine shows your immune system a germ's name badge **without** giving you the dangerous disease. Scientists have found several ways to do this.

**Weakened germs:** a live version of the germ that has been weakened so it cannot make a healthy person ill. The measles vaccine works like this.

**Inactivated germs:** germs that have been killed, so they cannot multiply at all.

**Pieces of germs:** just one harmless part, such as a single protein from the germ's surface.

**mRNA vaccines:** instead of the germ itself, the vaccine delivers instructions that tell some of your own cells to make one harmless piece of the germ for a short time. The immune system learns to recognise that piece. The instructions are broken down by your body within days, and they never enter the nucleus where your DNA is kept, so they cannot change your DNA.

Whatever the type, the result is the same: your body builds memory cells, so it is ready if the real germ ever shows up.

> Fun fact: the word "vaccine" comes from vacca, the Latin word for cow, because the very first vaccine was made using cowpox.

## Why does your arm sometimes hurt?

After a vaccine, some people get a sore arm, feel tired, or have a mild fever for a day or two. That is usually a good sign: it is your immune system doing its training. Serious side effects are rare. Vaccines are tested in large trials before they are approved, and they keep being monitored afterwards.

## Herd immunity: protecting people who cannot be vaccinated

Some people cannot have certain vaccines, such as newborn babies who are too young, or people whose immune systems are weakened by illnesses or treatments like chemotherapy. They rely on the people around them.

When enough people in a community are immune, a germ cannot find enough new people to infect, and the chain of infection breaks. This is called **herd immunity**. How many people need to be immune depends on how easily a disease spreads. Measles is one of the most contagious diseases known, so 95% or more of a community needs to be vaccinated to stop it spreading.

## Where it all began

In the 1790s, an English doctor named Edward Jenner noticed something curious: milkmaids who had caught cowpox, a mild disease from cows, did not seem to catch smallpox, one of the deadliest diseases in history. In May 1796, he tested the idea. He took material from a cowpox sore on a milkmaid's hand and gave it to an 8-year-old boy called James Phipps. Later, when Phipps was exposed to smallpox, he did not get ill. It was the world's first vaccine.

Nearly two centuries later, after a worldwide vaccination campaign, the World Health Organization declared smallpox eradicated in 1980. It is still the only human disease that has ever been wiped out completely.

> Fun fact: since 1974, vaccines are estimated to have saved over 154 million lives around the world. That is about six lives every minute.

## Questions to talk about

If a disease has almost disappeared, why might it come back if fewer people get vaccinated?

Herd immunity means your choice affects other people, not just you. How does that change the way you think about getting vaccinated?

Smallpox has been eradicated. Which disease do you think scientists should try to eradicate next, and what might make it difficult?

Sources: World Health Organization; The Royal Society; Children's Hospital of Philadelphia Vaccine Education Center; Royal College of Paediatrics and Child Health; Nature.
`,
  },
  {
    id: "superbugs-why-antibiotics-are-losing",
    title: "Superbugs: Why Antibiotics Are Losing the Battle",
    author: "BioBulletin",
    date: "2026-11-25",
    category: "Medicine",
    emoji: "🦠",
    excerpt: "Antibiotics turned deadly infections into easy cures. Now bacteria are fighting back, and evolution is on their side.",
    body: `
In 1940, a police officer in Oxford named Albert Alexander scratched his face on a rose bush. Today that would be nothing. But the scratch became infected, and the infection spread to his eyes, scalp and lungs. Doctors had no medicine that could stop it. He became one of the first people ever treated with a brand-new drug called **penicillin**, and within days he began to recover. Sadly, there was so little penicillin in the world that it ran out before he was cured, and he died. A few years later, that same drug was saving millions of lives.

## A lucky accident

In 1928, a Scottish scientist named **Alexander Fleming** came back from holiday to his laboratory at St Mary's Hospital in London. One of his dishes of bacteria had been contaminated by a mould. Around the mould, the bacteria had died. Something the mould was making was killing them. Fleming named the substance penicillin, after the Penicillium mould it came from.

Turning that discovery into a medicine took more than ten years. Scientists Howard Florey and Ernst Chain worked out how to purify penicillin in the early 1940s, and by the end of the Second World War it was being made in huge amounts. Fleming, Florey and Chain shared the Nobel Prize in 1945. The age of antibiotics had begun.

## How antibiotics work

Antibiotics are medicines that kill bacteria or stop them from multiplying. The clever part is that they attack things bacteria have but our own cells do not. For example, penicillin stops bacteria from building their cell walls properly, so they burst.

This is also why antibiotics **do not work against viruses**, like the ones that cause colds and flu. Viruses do not have cell walls or the other targets antibiotics attack. Taking antibiotics for a cold will not help you get better, but it can still help bacteria become resistant.

## Evolution in fast-forward

Bacteria multiply incredibly quickly. Every time one divides, there is a small chance its DNA copies with a mistake, called a **mutation**. Most mutations do nothing useful. But very occasionally, one gives a bacterium a way to survive an antibiotic.

Now imagine millions of bacteria and a dose of antibiotic. The antibiotic kills almost all of them, but the one resistant bacterium survives. With no competition left, it multiplies, and soon there is a whole population that the antibiotic cannot touch. This is **natural selection**, the same process that drives evolution, happening in days instead of millions of years.

Bacteria have another trick: they can pass resistance genes to each other, even between different species, using small loops of DNA called **plasmids**. It is a bit like handing a classmate the answers to a test.

> Fun fact: in perfect lab conditions, E. coli bacteria can divide every 20 minutes. Starting from a single cell, that is over a billion bacteria in about ten hours.

Fleming saw this coming. In his Nobel Prize speech in 1945, he warned that misusing penicillin could make bacteria resistant to it.

## How big is the problem?

Bacteria that resist several antibiotics are often called **superbugs**. A major study published in The Lancet estimated that in 2019, antibiotic-resistant infections directly caused about **1.27 million deaths**, more than HIV/AIDS or malaria that year. A follow-up study in 2024 forecast that, without more action, resistant infections could cause **more than 39 million deaths** between now and 2050.

One of the best-known superbugs is **MRSA**, a type of Staphylococcus aureus that is resistant to many common antibiotics.

> Fun fact: Staphylococcus aureus is the very same kind of bacteria Fleming was studying when he discovered penicillin.

## What makes resistance spread?

Using antibiotics when they are not needed, such as for viral infections, gives bacteria extra chances to evolve resistance. Large amounts of antibiotics are also used in farming. Infections spread more easily where hygiene and clean water are poor, and in hospitals, where many sick people are close together. On top of that, very few completely new types of antibiotic have been discovered in recent decades.

## What can be done?

Scientists are searching for new antibiotics, including by using artificial intelligence to scan huge numbers of molecules. Others are studying **bacteriophages**, viruses that infect and kill bacteria but leave human cells alone.

Everyone can help too. Wash your hands well, because preventing infections means fewer antibiotics are needed. Keep up to date with vaccines for the same reason. Never ask for antibiotics for a cold or flu. If a doctor prescribes antibiotics, take them exactly as instructed, and never share them or use leftover ones.

## Questions to talk about

Antibiotics have only existed for about 80 years. What do you think everyday life was like before them?

Why is it so hard to stop bacteria from evolving resistance, even when we use antibiotics carefully?

Should there be stricter rules on using antibiotics in farming? What are the arguments on each side?

Sources: The Lancet (Global Research on Antimicrobial Resistance studies, 2022 and 2024); University of Oxford; The Nobel Prize; Frontiers for Young Minds; ReAct.
`,
  },
  {
    id: "secret-maths-of-sunflowers",
    title: "The Secret Maths Hiding in Sunflowers",
    author: "Sample Writer",
    source: "Sample Science Magazine",          // optional
    link: "https://example.com/sunflower-maths", // optional
    date: "2026-11-21",
    category: "Maths",
    emoji: "🌻",
    excerpt: "Count the spirals in a sunflower and you'll find a famous number pattern. It's not a coincidence.",
    body: `
Look closely at the middle of a sunflower and you'll see seeds packed in spirals, some curving left and some curving right. Count them, and you'll usually get numbers like **34 and 55**, or **55 and 89**.

## Meet the Fibonacci numbers

Those numbers belong to the Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89... Each number is the sum of the two before it.

## Why would a flower do maths?

The flower isn't counting. Each new seed simply grows at a fixed turn from the last one, about **137.5 degrees**, called the golden angle. That angle packs seeds with almost no wasted space, and the Fibonacci spirals appear as a side effect.

> Fun fact: pinecones, pineapples and cauliflower show Fibonacci spirals too.

Next time you see a sunflower, try counting. You're looking at one of nature's best packing solutions.
`,
  },
  {
    id: "how-your-phone-knows-where-you-are",
    title: "How Does Your Phone Know Where You Are?",
    author: "Sample Writer",
    date: "2026-11-18",
    category: "Technology",
    emoji: "🛰️",
    excerpt: "Your map app is listening to satellites 20,000 km above you, and Einstein helps keep it accurate.",
    body: `
When your map shows a little blue dot, your phone is listening to **GPS satellites** about 20,000 km above Earth.

## Timing is everything

Each satellite constantly broadcasts the exact time and its position. The signal travels at the speed of light, so your phone can work out how far away each satellite is from how long the signal took to arrive.

## Four satellites, one answer

One distance tells you that you're somewhere on a huge sphere around that satellite. Add more satellites and the spheres only overlap in one place: where you are. Phones need signals from **at least four** satellites, because the fourth one fixes the small errors in the phone's own clock.

> Fun fact: GPS satellite clocks run slightly fast compared to clocks on Earth, as Einstein's theory of relativity predicts. Without correcting for this, GPS would drift by kilometres every day.
`,
  },
  {
    id: "what-your-brain-does-while-you-sleep",
    title: "What Your Brain Does While You Sleep",
    author: "Sample Writer",
    date: "2026-11-14",
    category: "Biology",
    emoji: "😴",
    excerpt: "Sleep isn't your brain switching off. It's more like the night shift cleaning crew arriving.",
    body: `
It feels like nothing happens when you sleep, but your brain is busy.

## Saving the day's memories

During sleep, your brain replays things you learned during the day and moves the important ones into long-term memory. That's why a good night's sleep before a test often helps more than staying up late to cram.

## The cleaning crew

Scientists have found that during deep sleep, fluid flows through the brain more quickly and washes away waste that builds up while you're awake. This is sometimes called the **glymphatic system**.

> Fun fact: most teenagers need around 8 to 10 hours of sleep a night.

So the next time someone says sleeping is lazy, you can tell them your brain is doing important maintenance work.
`,
  },
  {
    id: "why-is-the-sky-blue",
    title: "Why Is the Sky Blue?",
    author: "Sample Writer",
    date: "2026-11-10",
    category: "Physics",
    emoji: "🌤️",
    excerpt: "Sunlight contains every colour, so why does the sky choose blue? The answer is tiny bouncing light.",
    body: `
Sunlight looks white, but it's actually a mix of every colour of the rainbow. Each colour is a wave of light with a different length.

## Light bouncing off air

When sunlight enters the atmosphere, it bumps into tiny gas molecules. These molecules scatter short waves (blue and violet) **much more** than long waves (red and orange). This is called **Rayleigh scattering**.

So blue light gets bounced all over the sky, and wherever you look, some of it is coming towards your eyes.

## Then why not violet?

Violet scatters even more than blue, but our eyes are much more sensitive to blue, and some violet light is absorbed high in the atmosphere. The result looks blue to us.

> Fun fact: at sunset, light travels through much more air to reach you. Most of the blue is scattered away before it arrives, leaving the reds and oranges.
`,
  },
];
