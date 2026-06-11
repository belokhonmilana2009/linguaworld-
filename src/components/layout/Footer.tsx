import Link from "next/link";
import { IoLanguage } from "react-icons/io5";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <IoLanguage className="text-background" size={18} />
              </div>
              <span className="font-semibold">LinguaWorld</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Премиальная платформа для изучения английского языка. Проходи путь от A0 до C2.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-3">Платформа</h3>
            <ul className="space-y-2">
              <li><Link href="/learn" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Обучение</Link></li>
              <li><Link href="/grammar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Грамматика</Link></li>
              <li><Link href="/dictionary" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Словарь</Link></li>
              <li><Link href="/achievements" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Достижения</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-3">Уровни</h3>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">A0 — Beginner</span></li>
              <li><span className="text-sm text-muted-foreground">A1 — Elementary</span></li>
              <li><span className="text-sm text-muted-foreground">B1 — Intermediate</span></li>
              <li><span className="text-sm text-muted-foreground">C1 — Advanced</span></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-3">Поддержка</h3>
            <ul className="space-y-2">
              <li><a href="mailto:support@linguaworld.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">support@linguaworld.com</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Документация</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} LinguaWorld. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
