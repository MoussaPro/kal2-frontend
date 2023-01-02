<template>
    <div class="w-full py-4 bg-primary shadow-md">
        <div class="content flex items-center justify-between">
            <img src="@/assets/images/logo_white.png" class="w-16"/>

            <nav class="text-white font-medium">
                <ul class="flex space-x-10">
                    <li><RouterLink to="/">Forside</RouterLink></li>
                    <li><RouterLink to="/login">Log ind</RouterLink></li>
                </ul>
            </nav>
        </div>
    </div>
</template>