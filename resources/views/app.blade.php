<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-bs-theme="blue-theme">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Material+Icons+Outlined" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css">
    <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css">
    <!-- Scripts -->

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

<!-- jQuery (ensure it's loaded before others) -->
<script src="{{ asset('asset/js/jquery.min.js') }}"></script>

<!-- Legacy JS files that depend on jQuery -->
<script src="{{ asset('asset/js/main.js') }}"></script>

{{-- {{-- For chart Only --}}
{{-- <script src="{{ asset('asset/js/index.js') }}"></script> --}}
{{-- <script src="{{ asset('asset/js/index2.js') }}"></script> --}}
{{-- <script src="{{ asset('asset/js/dashboard1.js') }}"></script>
<script src="{{ asset('asset/js/dashboard2.js') }}"></script>
<script src="{{ asset('asset/js/data-widgets.js') }}"></script> --}}

</html>
