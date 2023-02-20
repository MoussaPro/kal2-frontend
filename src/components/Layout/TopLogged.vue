<template>
  <div class="w-full border-b border-gray-800 bg-gray-700 px-2 lg:px-16 shadow-md">
    <div class="flex items-center justify-between">
      <router-link to="/dashboard" class="pr-10"><img src="@/assets/images/logo_white.png" class="w-[75px]" alt="white logo"/></router-link>

      <nav class="text-gray-200 flex-1 font-inter font-normal hidden lg:block">
        <ul class="flex items-center">
          <li>
            <router-link to="/dashboard" active-class="bg-gray-800" class="flex hover:bg-gray-800 py-2 px-7 flex-col items-center text-xs hover-transition font-light justify-center">
              <img src="@/assets/images/navigation/home.png" alt="home icon" class="w-7"/>
              <p class="tracking-wide mt-[4px]">Hjem</p>
            </router-link>
          </li>
          <li>
            <router-link to="/calendar" active-class="bg-gray-800" class="flex hover:bg-gray-800 py-2 px-7 flex-col items-center text-xs hover-transition font-light justify-center">
              <img src="@/assets/images/navigation/calendar.png" alt="calendar icon" class="w-7"/>
              <p class="tracking-wide mt-[4px]">Kalender</p>
            </router-link>
          </li>
          <li>
            <router-link to="/directory" active-class="bg-gray-800" class="flex hover:bg-gray-800 py-2 px-7 flex-col items-center text-xs hover-transition font-light justify-center">
              <img src="@/assets/images/navigation/file.png" alt="file icon" class="w-7"/>
              <p class="tracking-wide mt-[4px]">Kartotek</p>
            </router-link>
          </li>
          <li>
            <router-link to="/data" active-class="bg-gray-800" class="flex hover:bg-gray-800 py-2 px-7 flex-col items-center text-xs hover-transition font-light justify-center">
              <img src="@/assets/images/navigation/data.png" alt="data icon" class="w-7"/>
              <p class="tracking-wide mt-[4px] ml-[-2px]">Data</p>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="hidden lg:flex items-center">
        <RouterLink to="/search" active-class="bg-gray-900 hover:bg-gray-900" class="flex py-2 px-3 cursor-pointer flex-col items-center text-xs hover-transition font-light justify-center text-gray-200 font-inter font-normal bg-[#434d60] rounded-md hover:bg-gray-800 mr-2">
          <img src="@/assets/images/navigation/search.png" alt="search icon" class="w-7"/>
        </RouterLink>
      </div>
      <div class="relative">
        <div @click="profileMenu = !profileMenu" class="text-gray-200 font-inter cursor-pointer text-center font-normal flex hover:bg-gray-800 h-full py-2 lg:px-7 flex-col items-center text-sm hover-transition font-light justify-center">
          <div class="capitalize leading-none">{{ auth.user.name }}</div>
          <img src="@/assets/images/navigation/arrow.png" alt="arrow icon" class="hover-transition" :class="profileMenu ? 'rotate-180 w-5 mt-2' : 'rotate-0 w-3 mt-1'"/>
        </div>
        <div class="absolute border border-gray-300 divide-y text-gray-700 divide-gray-300 font-semibold text-xs font-inter text-sm bg-white rounded w-[200px] z-30 right-[25px] top-[46px] shadow-xl hover-transition" v-if="profileMenu" v-click-outside="hideProfileMenu">
          <div class="p-[10px] hover:bg-gray-200 hover-transition cursor-pointer flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-[17px] mr-[5px]">
              <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
            </svg>
            Min profil
          </div>
          <div class="p-[10px] hover:bg-gray-200 hover-transition cursor-pointer flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-[17px] mr-[5px]">
              <path d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 01-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 016.126 3.537zM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 010 .75l-1.732 3.001c-.229.396-.76.498-1.067.16A5.231 5.231 0 016.75 12c0-1.362.519-2.603 1.37-3.536zM10.878 17.13c-.447-.097-.623-.608-.394-1.003l1.733-3.003a.75.75 0 01.65-.375h3.465c.457 0 .81.408.672.843a5.252 5.252 0 01-6.126 3.538z" />
              <path fill-rule="evenodd" d="M21 12.75a.75.75 0 000-1.5h-.783a8.22 8.22 0 00-.237-1.357l.734-.267a.75.75 0 10-.513-1.41l-.735.268a8.24 8.24 0 00-.689-1.191l.6-.504a.75.75 0 10-.964-1.149l-.6.504a8.3 8.3 0 00-1.054-.885l.391-.678a.75.75 0 10-1.299-.75l-.39.677a8.188 8.188 0 00-1.295-.471l.136-.77a.75.75 0 00-1.477-.26l-.136.77a8.364 8.364 0 00-1.377 0l-.136-.77a.75.75 0 10-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 00-1.3.75l.392.678a8.29 8.29 0 00-1.054.885l-.6-.504a.75.75 0 00-.965 1.149l.6.503a8.243 8.243 0 00-.689 1.192L3.8 8.217a.75.75 0 10-.513 1.41l.735.267a8.222 8.222 0 00-.238 1.355h-.783a.75.75 0 000 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 10.513 1.41l.735-.268c.197.417.428.816.69 1.192l-.6.504a.75.75 0 10.963 1.149l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 101.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.771a.75.75 0 101.477.26l.137-.772a8.376 8.376 0 001.376 0l.136.773a.75.75 0 101.477-.26l-.136-.772a8.19 8.19 0 001.294-.47l.391.677a.75.75 0 101.3-.75l-.393-.679a8.282 8.282 0 001.054-.885l.601.504a.75.75 0 10.964-1.15l-.6-.503a8.24 8.24 0 00.69-1.191l.735.268a.75.75 0 10.512-1.41l-.734-.268c.115-.438.195-.892.237-1.356h.784zm-2.657-3.06a6.744 6.744 0 00-1.19-2.053 6.784 6.784 0 00-1.82-1.51A6.704 6.704 0 0012 5.25a6.801 6.801 0 00-1.225.111 6.7 6.7 0 00-2.15.792 6.784 6.784 0 00-2.952 3.489.758.758 0 01-.036.099A6.74 6.74 0 005.251 12a6.739 6.739 0 003.355 5.835l.01.006.01.005a6.706 6.706 0 002.203.802c.007 0 .014.002.021.004a6.792 6.792 0 002.301 0l.022-.004a6.707 6.707 0 002.228-.816 6.781 6.781 0 001.762-1.483l.009-.01.009-.012a6.744 6.744 0 001.18-2.064c.253-.708.39-1.47.39-2.264a6.74 6.74 0 00-.408-2.308z" clip-rule="evenodd" />
            </svg>
            Indstillinger
          </div>
          <RouterLink to="/logout" class="p-[10px] text-red-500 hover:bg-gray-200 hover-transition cursor-pointer flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-[17px] mr-[5px]">
              <path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z" clip-rule="evenodd" />
            </svg>
            Log mig ud
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Auth } from "@/store/auth";
  import { ref } from "vue";
  const auth = Auth();

  const logout = () => {
    auth.logout();
  }

  const searchActive = ref(false);
  const searchTerm = ref();
  const searchInput = ref();
  const profileMenu = ref(false);

  const hideProfileMenu = () => {
    profileMenu.value = false;
  }
</script>