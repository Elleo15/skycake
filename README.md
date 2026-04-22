# ☁️ Sky Cake — Website

**Səma Əhmədova**nın tort və şirniyyat brendinin rəsmi vebsaytı.

---

## 📁 Fayl Strukturu

```
sky-cake/
├── index.html        # Əsas HTML faylı
├── style.css         # Bütün stillər
├── script.js         # JavaScript funksiyalar
└── images/           # Bütün şəkil və videolar
```

---

## 🌐 Bölmələr

| Bölmə | Təsvir |
|-------|--------|
| **Hero** | Parallax arxa plan, "Sky Cake" animasiyası |
| **Haqqımda** | Səmanın təqdimatı, statistikalar |
| **Məhsullar** | Tort, keks, şirniyyat, desert, xəmir kateqoriyaları |
| **Qalereya** | Arı pətəyi (hexagon) dizaynlı foto/video qalereya |
| **Sifariş** | WhatsApp-a hazır mesaj göndərən form |
| **Çatdırılma** | Çatdırılma məlumatları |
| **Əlaqə** | Instagram və WhatsApp linklər |

---

## ✏️ Dəyişiklik Bələdçisi

### 🖼️ Şəkil dəyişmək
Bütün şəkillər `images/` qovluğundadır. Şəkli əvəz etmək üçün eyni adla yeni faylı qovluğa yapışdır.

### 🎨 Rəngləri dəyişmək
`style.css` faylının **ən başında** CSS dəyişənlər var:
```css
:root {
  --color-primary: #c8849a;   /* Əsas çəhrayı rəng */
  --color-bg: #fdf6f0;        /* Arxa plan rəngi */
  --color-gold: #d4af8c;      /* Qızılı rəng */
}
```

### 📝 Mətnləri dəyişmək
Hər mətn elementinin 3 dil atributu var:
```html
data-az="Azərbaycan mətni"
data-ru="Rus mətni"
data-en="İngilis mətni"
```

### 📱 WhatsApp nömrəsini dəyişmək
`script.js` faylında:
```js
const WHATSAPP_NUMBER = '994706403464';
```

### 📸 Qalereyaya şəkil/video əlavə etmək
`index.html`-də `hex-grid` bölməsində yeni `hex-item` əlavə et:
```html
<div class="hex-item" data-img="images/yeni-sekil.png">
  <div class="hex-border"></div>
  <div class="hex-inner">
    <img src="images/yeni-sekil.png" loading="lazy" />
  </div>
</div>
```

Video üçün:
```html
<div class="hex-item">
  <div class="hex-border"></div>
  <div class="hex-inner">
    <video autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;">
      <source src="images/video.mp4" type="video/mp4">
    </video>
  </div>
</div>
```

### 🌍 Dil əlavə etmək
1. `index.html`-də hər elementə yeni `data-xx` atributu əlavə et
2. `script.js`-də `applyLanguage` funksiyasına yeni dili əlavə et
3. Navbar-da yeni `lang-btn` düyməsi əlavə et

---

## ⚙️ Texniki Məlumat

| Xüsusiyyət | Dəyər |
|------------|-------|
| **Texnologiya** | HTML5 / CSS3 / Vanilla JS |
| **Dillər** | AZ / RU / EN |
| **Fontlar** | Cormorant Garamond, Great Vibes, Montserrat |
| **Mobil** | Tam responsive |
| **Xarici kitabxana** | Yoxdur — pure vanilla |

---

## 🔗 Əlaqə

- **Instagram:** [@sky_.cake](https://instagram.com/sky_.cake)
- **WhatsApp:** +994 70 640 34 64

---

## 👨‍💻 Developer

**Elvin Eyvazov** — [GitHub](https://github.com)

---

*© 2025 Sky Cake — Handcrafted by Səma*
