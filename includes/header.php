<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/../src/Auth.php';
$currentUser = Auth::getUser();
?>
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?? 'Orbit Nutrition | 10-Matrix Direct Selling' ?></title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        navy: {
                            950: '#0b0f19',
                            900: '#111827',
                            800: '#1f2937',
                        },
                        cyan: {
                            400: '#22d3ee',
                            500: '#06b6d4',
                            600: '#0891b2',
                        }
                    },
                    boxShadow: {
                        neon: '0 0 20px rgba(6, 182, 212, 0.35)',
                    }
                }
            }
        }
    </script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body {
            background-color: #0b0f19;
            color: #f3f4f6;
            font-family: ui-sans-serif, system-ui, sans-serif;
        }
        .glass-panel {
            background: rgba(17, 24, 39, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
        }
    </style>
</head>
<body class="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">

<!-- Header Navbar -->
<header class="sticky top-0 z-40 border-b border-cyan-500/20 glass-panel bg-[#0b0f19]/80 backdrop-blur-xl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <!-- Brand Logo -->
        <a href="index.php" class="flex items-center space-x-3 group">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 p-0.5 shadow-neon group-hover:scale-105 transition-transform">
                <div class="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <i data-lucide="zap" class="w-5 h-5 text-cyan-400"></i>
                </div>
            </div>
            <div class="flex flex-col">
                <span class="text-xl font-black tracking-wider text-white flex items-center">
                    ORBIT<span class="text-cyan-400 font-mono">NUTRITION</span>
                </span>
                <span class="text-[10px] font-mono text-cyan-400 tracking-widest uppercase -mt-1">
                    10-Matrix Protein Plan
                </span>
            </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="index.php" class="hover:text-cyan-400 transition-colors">Home</a>
            <a href="about.php" class="hover:text-cyan-400 transition-colors">About Brand</a>
            <a href="business-plan.php" class="hover:text-cyan-400 transition-colors">10-Matrix Plan</a>
            <a href="contact.php" class="hover:text-cyan-400 transition-colors">Contact</a>
        </nav>

        <!-- Right User / Auth Actions -->
        <div class="flex items-center space-x-4">
            <?php if ($currentUser): ?>
                <a href="dashboard.php" class="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-400 font-mono text-xs font-bold flex items-center space-x-2 transition-all">
                    <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
                    <span>Dashboard (<?= htmlspecialchars($currentUser['id']) ?>)</span>
                </a>
                <?php if ($currentUser['role'] === 'admin'): ?>
                    <a href="admin.php" class="px-3 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold flex items-center space-x-1">
                        <i data-lucide="shield-check" class="w-4 h-4"></i>
                        <span>Admin</span>
                    </a>
                <?php endif; ?>
                <a href="logout.php" class="text-slate-400 hover:text-red-400 p-2 transition-colors" title="Logout">
                    <i data-lucide="log-out" class="w-5 h-5"></i>
                </a>
            <?php else: ?>
                <a href="login.php" class="text-xs font-mono font-bold text-slate-300 hover:text-cyan-400 transition-colors">
                    Sign In
                </a>
                <a href="register.php" class="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-300 hover:to-cyan-500 text-slate-950 font-black text-xs shadow-neon transition-all">
                    Join Direct Selling
                </a>
            <?php endif; ?>
        </div>
    </div>
</header>

<main class="flex-grow">
