"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ROUTES, LEVEL_LIST } from "@/lib/constants";
import { IoChevronForward, IoMic, IoText, IoImage, IoHeadset, IoLanguage, IoRocket, IoTrophy, IoShieldCheckmark, IoGlobe, IoStar, IoSparkles, IoChevronDown } from "react-icons/io5";
import { Footer } from "@/components/layout/Footer";

const stats = [
  { value: 700, suffix: "+", label: "заданий", icon: IoText },
  { value: 7, suffix: "", label: "уровней", icon: IoTrophy },
  { value: 99, suffix: "%", label: "AI проверка", icon: IoShieldCheckmark },
  { value: 50, suffix: "+", label: "голосовых заданий", icon: IoMic },
];

const features = [
  {
    icon: IoSparkles,
    title: "ИИ-проверка ответов",
    description: "Нейросеть анализирует твои ответы, находит ошибки и даёт персонализированные рекомендации для улучшения.",
  },
  {
    icon: IoMic,
    title: "Голосовые задания",
    description: "Тренируй произношение с помощью голосового ввода. ИИ оценивает точность и помогает исправить акцент.",
  },
  {
    icon: IoImage,
    title: "Визуальное обучение",
    description: "Описывай изображения и сцены на английском. Развивай словарный запас через ассоциации с картинками.",
  },
  {
    icon: IoRocket,
    title: "Геймификация",
    description: "Зарабатывай очки, открывай достижения и соревнуйся с друзьями. Обучение превращается в увлекательное приключение.",
  },
  {
    icon: IoGlobe,
    title: "7 уровней",
    description: "От A0 до C2 — структурированная программа, которая ведёт тебя от первых слов до свободного владения языком.",
  },
  {
    icon: IoShieldCheckmark,
    title: "Сертификаты",
    description: "После завершения каждого уровня получай официальный сертификат, подтверждающий твои знания английского.",
  },
];

const steps = [
  { number: "01", title: "Выбери уровень", description: "Пройди тест или начни с любого из 7 уровней — от Starter до Proficiency." },
  { number: "02", title: "Выполняй задания", description: "Отвечай на вопросы, записывай голос, переводи тексты и описывай изображения." },
  { number: "03", title: "Получай фидбек от ИИ", description: "Мгновенная проверка с детальным разбором ошибок и советами по улучшению." },
  { number: "04", title: "Получи сертификат", description: "Сдавай уровневые тесты и получай сертификаты, подтверждающие прогресс." },
];

const testimonials = [
  {
    name: "Анна Кузнецова",
    role: "Студентка, B2",
    avatar: "AK",
    quote: "LinguaWorld изменил моё отношение к изучению языка. ИИ-проверка объясняет каждую ошибку так, что запоминаешь правило навсегда. За 3 месяца поднялась с A2 до B1!",
    color: "from-[#667eea] to-[#764ba2]",
  },
  {
    name: "Дмитрий Волков",
    role: "IT-специалист, C1",
    avatar: "ДВ",
    quote: "Голосовые задания — это прорыв. Я наконец-то начал говорить, а не просто читать и переводить. Алгоритм распознаёт даже лёгкий акцент и даёт точные рекомендации.",
    color: "from-[#f093fb] to-[#f5576c]",
  },
  {
    name: "Елена Морозова",
    role: "Преподаватель, C2",
    avatar: "ЕМ",
    quote: "Рекомендую всем своим ученикам. Структура уровней продумана идеально, а геймификация мотивирует заниматься каждый день. Лучшая платформа для самостоятельного изучения.",
    color: "from-[#4facfe] to-[#00f2fe]",
  },
];

const faqs = [
  {
    q: "С какого уровня начинать обучение?",
    a: "Ты можешь начать с любого уровня. Если сомневаешься — пройди вступительный тест, который определит твой текущий уровень и порекомендует стартовую точку. Тест занимает около 15 минут.",
  },
  {
    q: "Как работает ИИ-проверка ответов?",
    a: "Нейросеть анализирует твой ответ по множеству параметров: грамматика, лексика, порядок слов, пунктуация. Для голосовых заданий дополнительно оценивается произношение. Ты получаешь детальный разбор каждой ошибки.",
  },
  {
    q: "Сколько времени нужно уделять в день?",
    a: "Оптимально заниматься 15–30 минут в день. Система адаптируется под твой темп: можно проходить по 5–10 заданий в день или интенсивно готовиться по 1–2 часа. Главное — регулярность.",
  },
  {
    q: "Есть ли мобильное приложение?",
    a: "Да, LinguaWorld доступен на всех устройствах. Веб-версия адаптирована под мобильные экраны, а нативные приложения для iOS и Android находятся в разработке. Скоро ты сможешь заниматься где угодно.",
  },
  {
    q: "Сертификаты действительно подтверждают уровень?",
    a: "Да, каждый сертификат содержит уникальный номер и результаты итогового теста. Сертификаты уровня C1 и C2 признаются партнёрскими образовательными организациями. Золотой сертификат выдаётся за идеальное прохождение уровня.",
  },
  {
    q: "Можно ли заниматься бесплатно?",
    a: "Бесплатный тариф включает доступ к первым 20 заданиям каждого уровня и базовой статистике. Для полного доступа ко всем заданиям, голосовым упражнениям и сертификатам нужна подписка.",
  },
];

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-16"
    >
      <Badge variant="info" size="md" className="mb-4">
        {subtitle || "Премиум обучение"}
      </Badge>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
        <span className="gradient-text">{title}</span>
      </h2>
    </motion.div>
  );
}

function FadeInView({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  const handleInView = () => {
    if (count > 0) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    setCount(-1);
  };

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={handleInView}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-5xl md:text-6xl font-bold tracking-tight"
    >
      {count > 0 ? `${count}${suffix}` : `0${suffix}`}
    </motion.span>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#f093fb]/20 to-[#f5576c]/20 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: "1s" }} />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge variant="info" size="md" className="mb-6">
              Премиальная платформа с ИИ
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] text-balance max-w-4xl mx-auto mb-6">
              Путешествие в мир{" "}
              <span className="gradient-text">английского</span>
              <br />начинается здесь
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Проходи путь от A0 до C2 через интерактивные задания, голосовые ответы
              и персонализированную проверку от искусственного интеллекта.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" icon={<IoRocket />}>
                Начать обучение
              </Button>
              <Button variant="outline" size="lg" icon={<IoChevronForward />}>
                Узнать больше
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1.5"><IoShieldCheckmark className="text-success" size={16} /> ИИ-проверка</span>
            <span className="flex items-center gap-1.5"><IoMic className="text-info" size={16} /> Голосовой ввод</span>
            <span className="flex items-center gap-1.5"><IoTrophy className="text-warning" size={16} /> 7 уровней</span>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Всё для твоего прогресса" subtitle="Возможности платформы" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <FadeInView key={feature.title} delay={i * 0.08}>
                  <div className="group relative p-6 rounded-2xl border border-border bg-card/50 hover:bg-card transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-foreground" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </FadeInView>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Как это работает" subtitle="4 простых шага" />
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] transform -translate-y-1/2" style={{ width: "75%" }} />
            {steps.map((step, i) => (
              <FadeInView key={step.number} delay={i * 0.12} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 w-24 h-24 rounded-full bg-foreground text-background flex items-center justify-center text-xl font-bold mb-6 shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Level Map */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Карта уровней" subtitle="7 уровней — 7 городов мира" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {LEVEL_LIST.map((level, i) => (
              <FadeInView key={level.id} delay={i * 0.06}>
                <div className="group relative p-5 rounded-2xl border border-border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="text-3xl mb-3">{level.flag}</div>
                  <Badge
                    variant={
                      level.strictness === "strict" ? "danger" :
                      level.strictness === "medium" ? "warning" : "success"
                    }
                    size="sm"
                    className="mb-2"
                  >
                    {level.id}
                  </Badge>
                  <h3 className="font-semibold text-sm">{level.city}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{level.name}</p>
                  <div className={`mt-3 h-1 w-full rounded-full bg-gradient-to-r ${level.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <IoGlobe size={10} /> {level.description}
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Example Lessons */}
      <section className="py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Примеры заданий" subtitle="Разные форматы для полного погружения" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeInView delay={0}>
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <IoText className="text-blue-500" size={20} />
                </div>
                <Badge variant="info" size="sm" className="mb-3">Текстовый ответ</Badge>
                <p className="text-sm font-medium mb-2">Переведите на английский:</p>
                <p className="text-lg italic text-muted-foreground mb-4">&laquo;Я всегда мечтал путешествовать по миру&raquo;</p>
                <div className="p-3 rounded-xl bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground">Ваш ответ:</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-8 bg-background rounded-lg border border-border" />
                    <Button size="sm" variant="primary">Проверить</Button>
                  </div>
                </div>
              </div>
            </FadeInView>
            <FadeInView delay={0.1}>
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <IoMic className="text-green-500" size={20} />
                </div>
                <Badge variant="success" size="sm" className="mb-3">Голосовое задание</Badge>
                <p className="text-sm font-medium mb-2">Произнесите фразу:</p>
                <p className="text-lg italic text-muted-foreground mb-4">&laquo;The weather is beautiful today&raquo;</p>
                <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Нажмите, чтобы говорить</span>
                  <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                    <IoMic size={18} />
                  </div>
                </div>
              </div>
            </FadeInView>
            <FadeInView delay={0.2}>
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <IoImage className="text-purple-500" size={20} />
                </div>
                <Badge variant="info" size="sm" className="mb-3">Описание изображения</Badge>
                <p className="text-sm font-medium mb-2">Опишите, что вы видите:</p>
                <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border border-border flex items-center justify-center h-24">
                  <IoImage size={32} className="text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-8 bg-background rounded-lg border border-border" />
                  <Button size="sm" variant="primary">Отправить</Button>
                </div>
              </div>
            </FadeInView>
            <FadeInView delay={0.3}>
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4">
                  <IoLanguage className="text-yellow-500" size={20} />
                </div>
                <Badge variant="warning" size="sm" className="mb-3">Перевод</Badge>
                <p className="text-sm font-medium mb-2">Переведите на русский:</p>
                <p className="text-lg italic text-muted-foreground mb-4">&laquo;Knowledge is power&raquo;</p>
                <div className="p-3 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-8 bg-background rounded-lg border border-border" />
                    <Button size="sm" variant="primary">Проверить</Button>
                  </div>
                </div>
              </div>
            </FadeInView>
            <FadeInView delay={0.4}>
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <IoHeadset className="text-red-500" size={20} />
                </div>
                <Badge variant="danger" size="sm" className="mb-3">Аудирование</Badge>
                <p className="text-sm font-medium mb-2">Прослушайте и напишите:</p>
                <p className="text-lg italic text-muted-foreground mb-4">🔊 Нажмите, чтобы прослушать</p>
                <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Что вы услышали?</span>
                  <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                    <IoHeadset size={18} />
                  </div>
                </div>
              </div>
            </FadeInView>
            <FadeInView delay={0.5}>
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center mb-4">
                  <IoSparkles className="text-foreground" size={20} />
                </div>
                <Badge variant="gold" size="sm" className="mb-3">ИИ-фидбек</Badge>
                <p className="text-sm font-medium mb-2">Пример проверки:</p>
                <div className="p-3 rounded-xl bg-muted/50 border border-border space-y-2">
                  <p className="text-sm"><span className="line-through text-destructive">I am go</span> <span className="text-success font-medium">&rarr; I go</span></p>
                  <p className="text-xs text-muted-foreground">Ошибка: неправильное использование глагола to be. В настоящем времени для I используем go без am.</p>
                  <div className="flex gap-1">
                    <Badge variant="success" size="sm">Грамматика</Badge>
                    <Badge variant="warning" size="sm">Порядок слов</Badge>
                  </div>
                </div>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* Advantages / Stats */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Цифры говорят сами за себя" subtitle="Статистика платформы" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <FadeInView key={stat.label} delay={i * 0.1} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-foreground" size={24} />
                  </div>
                  <Counter value={stat.value} suffix={stat.suffix} />
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </FadeInView>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="Что говорят ученики" subtitle="Отзывы" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeInView key={t.name} delay={i * 0.1}>
                <div className="relative p-6 rounded-2xl border border-border bg-card h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-sm font-bold text-white`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(5)].map((_, si) => (
                        <IoStar key={si} size={12} className="text-warning fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">&laquo;{t.quote}&raquo;</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHeader title="Часто задаваемые вопросы" subtitle="FAQ" />
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeInView key={i} delay={i * 0.05}>
                <div className="rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-medium text-sm pr-4">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <IoChevronDown size={18} className="text-muted-foreground" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === i ? "auto" : 0,
                      opacity: openFaq === i ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge variant="info" size="md" className="mb-4">Начни прямо сейчас</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance mb-4">
              Готов начать своё<br />
              <span className="gradient-text">путешествие?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Присоединяйся к тысячам учеников, которые уже изучают английский
              с помощью ИИ. Первые задания — бесплатно.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" icon={<IoRocket />}>
                Начать бесплатно
              </Button>
              <Button variant="outline" size="lg">
                Посмотреть тарифы
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
