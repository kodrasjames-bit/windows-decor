# Zveřejnění windows-decor bez instalace na PC

Na druhém počítači budete otevírat jen internetovou adresu. GitHub aplikaci sestaví a hostuje. Současná příprava sama repozitář nevytváří ani web nezveřejňuje.

## 1. Vytvořte repozitář

1. Přihlaste se na https://github.com/ a otevřete https://github.com/new.
2. Do Repository name napište přesně `windows-decor`.
3. Pro GitHub Free zvolte Public. Veřejně dostupný bude web i zdrojové soubory. Pages pro soukromý repozitář vyžadují odpovídající placený plán.
4. Zaškrtněte vytvoření README a klikněte na Create repository. Použijte výchozí větev `main`.

## 2. Zapněte Pages

V novém repozitáři otevřete **Settings → Pages**. U **Build and deployment → Source** vyberte **GitHub Actions**. Žádnou nabízenou šablonu zatím nevytvářejte: potřebný workflow je v připraveném balíčku.

## 3. Nahrajte soubory

1. Rozbalte `windows-decor-github.zip` do nové složky.
2. V repozitáři otevřete záložku **Code → Add file → Upload files**.
3. Přetáhněte do stránky celý **obsah rozbalené složky**, včetně složky `.github`. Nenahrávejte samotný ZIP ani nadřazenou složku.
4. Přímo v kořeni repozitáře musí být `package.json`, `package-lock.json`, `next.config.ts` a složky `app`, `components`, `public`, `.github` a další soubory balíčku. Workflow má být na cestě `.github/workflows/pages.yml`.
5. Klikněte na **Commit changes**, potvrďte uložení do `main`.

ZIP obsahuje pouze zdrojové soubory a potřebné obrázky. `node_modules`, `.next` ani `out` se nenahrávají. Pokud upload přes prohlížeč vynechá `.github`, nahrajte ji zvlášť; bez ní se automatické sestavení nespustí.

## 4. Počkejte na sestavení

V záložce **Actions** se objeví **Publish windows-decor**. Po dokončení musí mít úlohy `build` i `deploy` zelenou značku. Na první sestavení ponechte několik minut. Pokud se nespustilo, otevřete workflow a použijte **Run workflow → main → Run workflow**.

Adresu najdete v **Settings → Pages → Visit site** nebo u dokončeného nasazení. Pro běžný osobní účet bude mít tvar:

```text
https://JMENO-UZIVATELE.github.io/windows-decor/
```

`JMENO-UZIVATELE` nahraďte skutečným jménem účtu. Tuto adresu pak lze otevřít na jiném PC nebo telefonu bez instalace. Nastavení barev se ukládá zvlášť do každého prohlížeče; mezi počítači se nepřenáší.

## Další úpravy a potíže

- Každé nahrání upravených souborů do `main` spustí nové sestavení a nasazení.
- Chyba při Configure Pages: ověřte Source = GitHub Actions a dostupnost Pages pro váš plán a viditelnost repozitáře; pak v Actions spusťte **Re-run all jobs**.
- Chybí workflow: ověřte cestu `.github/workflows/pages.yml` přímo v kořeni repozitáře.
- Chybí obrázky: ověřte, že jste nahráli složku `public` a otevíráte adresu s `/windows-decor/`.
- Chyba v testech nebo buildu: v Actions otevřete červený krok; jeho chybovou zprávu pošlete do této konverzace.

Podklady: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [volba zdroje publikování](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
