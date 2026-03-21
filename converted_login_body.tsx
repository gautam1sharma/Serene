
{/*  Top Navigation Anchor (Manual suppression of links for login context)  */}
<header className="fixed top-0 w-full z-50 flex justify-between items-center w-full px-12 py-8 bg-transparent">
<div className="flex flex-col">
<span className="text-2xl font-headline tracking-widest uppercase text-stone-100 dark:text-stone-200">Obsidian Portal</span>
<span className="font-label text-[10px] uppercase tracking-[0.2em] text-clogin-on-surface-variant mt-1">Customer Portal</span>
</div>
<div className="hidden md:flex items-center gap-6">
<span className="material-symbols-outlined text-stone-300 dark:text-stone-400 cursor-pointer hover:text-stone-100 transition-all duration-300">language</span>
</div>
</header>
<main className="min-h-screen flex flex-col md:flex-row">
{/*  Left: Cinematic Hero  */}
<section className="relative w-full md:w-1/2 h-64 md:h-screen overflow-hidden">
<img alt="Luxury dark sports car cinematic lighting" className="absolute inset-0 w-full h-full object-cover" data-alt="Cinematic shot of a luxury dark vehicle in shadow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6Wepar14fgty3Dz7Yyv93Icl0qOOzkRcCC1e5KKz5BT435F9KpMLy_gulRX2G8pc9_XynfHTK9_UCr0aM_PxbFZyW5duRLU5VBAx3ta-0AW-xc7vKTa0Ovo7Mr0pxDcFATAWMqAZUwiQ2_JThChvEmp5oFiF09vnamhI8D9F7OLEMpzM4g_E5naupj5lUsxvV-nuoIPmyMIC2f61AOb_aG-3xqzsg3yRuz40cr8md2jWTteezxZfJxzU_AiTehh0IUFxrWR-Utwm1"/>
{/*  Dark Gradient Overlay  */}
<div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent opacity-80 md:opacity-100"></div>
<div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
{/*  Tagline  */}
<div className="absolute bottom-12 md:bottom-auto md:top-1/2 md:-translate-y-1/2 left-12 max-w-md">
<h1 className="font-headline italic text-4xl md:text-6xl text-stone-100 tracking-tighter leading-tight">
                    The intersection of <br/>
<span className="text-clogin-primary-dim">engineering &amp; art.</span>
</h1>
<p className="font-label text-sm uppercase tracking-widest text-clogin-on-surface-variant mt-6">Defined by the shadows we cast.</p>
</div>
</section>
{/*  Right: Login Form Area  */}
<section className="w-full md:w-1/2 h-full bg-clogin-surface-dim flex items-center justify-center p-6 md:p-12 relative">
{/*  Recessed Architectural Layer  */}
<div className="absolute inset-0 bg-clogin-surface-container-low opacity-50"></div>
{/*  Login Card  */}
<div className="glass-card relative z-10 w-full max-w-md p-10 rounded-lg shadow-2xl">
<div className="mb-12">
<h2 className="font-headline text-3xl text-stone-100 mb-2">Access Portal</h2>
<p className="font-body text-clogin-on-surface-variant text-sm">Enter your credentials to manage your collection.</p>
</div>
<form className="space-y-10">
{/*  Email Field  */}
<div className="relative group input-underline-focus">
<label className="block font-label text-[10px] uppercase tracking-widest text-clogin-on-surface-variant mb-1">Email Address</label>
<input className="w-full bg-transparent border-0 border-b border-clogin-outline-variant py-3 px-0 text-stone-100 focus:ring-0 focus:border-clogin-primary transition-colors font-body placeholder-stone-700" placeholder="name@exclusive.com" type="email"/>
<div className="line-draw absolute bottom-0 left-0 h-[1px] bg-clogin-primary w-0 transition-all duration-500 ease-in-out"></div>
</div>
{/*  Password Field  */}
<div className="relative group input-underline-focus">
<label className="block font-label text-[10px] uppercase tracking-widest text-clogin-on-surface-variant mb-1">Passcode</label>
<input className="w-full bg-transparent border-0 border-b border-clogin-outline-variant py-3 px-0 text-stone-100 focus:ring-0 focus:border-clogin-primary transition-colors font-body placeholder-stone-700" placeholder="••••••••" type="password"/>
<div className="line-draw absolute bottom-0 left-0 h-[1px] bg-clogin-primary w-0 transition-all duration-500 ease-in-out"></div>
</div>
{/*  Actions  */}
<div className="space-y-4 pt-4">
<button className="metallic-shimmer w-full py-4 px-6 flex items-center justify-center gap-3 text-clogin-on-primary font-label font-semibold uppercase tracking-[0.15em] text-xs rounded hover:opacity-90 transition-opacity active:scale-[0.98] duration-200" type="submit">
                            Sign In
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
</button>
<button className="w-full py-4 px-6 border border-clogin-outline/20 text-clogin-primary font-label text-[10px] uppercase tracking-[0.2em] rounded hover:bg-clogin-surface-bright/20 transition-colors" type="button">
                            Use demo credentials
                        </button>
</div>
<div className="flex justify-between items-center pt-4">
<a className="font-label text-[10px] uppercase tracking-widest text-clogin-on-surface-variant hover:text-clogin-primary transition-colors" href="#">Forgot passcode?</a>
<a className="font-label text-[10px] uppercase tracking-widest text-clogin-primary hover:underline underline-offset-4" href="#">Request Access</a>
</div>
</form>
</div>
</section>
</main>
{/*  Footer Anchor  */}
<footer className="fixed bottom-0 w-full flex flex-row justify-between items-center px-12 py-6 w-full bg-stone-950/80 dark:bg-stone-950/90 z-50">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-clogin-primary text-xs" style="font-variation-settings: 'FILL' 1;">lock</span>
<span className="font-sans uppercase tracking-[0.2em] text-[10px] text-stone-500 dark:text-stone-600">SECURE ENTERPRISE ACCESS</span>
</div>
<div className="flex gap-8">
<a className="font-sans uppercase tracking-[0.2em] text-[10px] text-stone-600 hover:text-stone-200 transition-colors" href="#">Privacy Policy</a>
<a className="font-sans uppercase tracking-[0.2em] text-[10px] text-stone-600 hover:text-stone-200 transition-colors" href="#">Legal</a>
</div>
</footer>
