// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			pixel: ['"Press Start 2P"', 'cursive'],
  			'pixel-jp': ['"DotGothic16"', 'sans-serif'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'pixel': '0px',
  		},
  		colors: {
        // CSSカスタムプロパティを参照するように修正
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))', // inputも追加する場合 (shadcn/uiでよく使われる)
        ring: 'hsl(var(--ring))', // ringも追加する場合 (shadcn/uiでよく使われる)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { // primaryもshadcn/uiの構造に合わせて定義
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: { // secondaryもshadcn/uiの構造に合わせて定義
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: { // destructiveもshadcn/uiの構造に合わせて定義
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: { // mutedもshadcn/uiの構造に合わせて定義
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: { // accentもshadcn/uiの構造に合わせて定義
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: { // popoverもshadcn/uiの構造に合わせて定義
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: { // cardもshadcn/uiの構造に合わせて定義
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
  			sidebar: { // sidebarの定義は既存のものを活かす
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border-specific, var(--border)))', // Sidebar固有のボーダー、なければデフォルトの--borderを参照
  				ring: 'hsl(var(--sidebar-ring))'
  			},
        // 既存のVALORANTカラーパレットなどはここに含めるか、別途管理
        'valorant-red': '#FF4655',
        'valorant-teal': '#00D4AA',
        'valorant-gold': '#F0B90B',
        'valorant-blue': '#389BFF',
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
      backgroundImage: {
        'hero-pattern-1': `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`,
        'hero-pattern-2': `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`,
        'detail-pattern': `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ff4655" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`,
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
