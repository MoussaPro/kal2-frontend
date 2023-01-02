<template>
  <div class="w-full border-b border-gray-800 bg-gray-700 px-16 shadow-md">
    <div class="flex items-center justify-between">
      <router-link to="/dashboard" class="pr-10"><img src="@/assets/images/logo_white.png" class="w-[75px]" alt="white logo"/></router-link>

      <nav class="text-gray-200 flex-1 font-inter font-normal">
        <ul class="flex items-center">
          <li>
            <router-link to="/dashboard" active-class="bg-gray-800" class="flex hover:bg-gray-800 py-2 px-7 flex-col items-center text-xs hover-transition font-light justify-center">
              <i class="fa-solid fa-house text-[26px] mt-[2px]"></i>
              <p class="tracking-wide mt-[4px]">Hjem</p>
            </router-link>
          </li>
          <li>
            <router-link to="/calendar" active-class="bg-gray-800" class="flex hover:bg-gray-800 py-2 px-7 flex-col items-center text-xs hover-transition font-light justify-center">
              <i class="fa-solid fa-calendar text-[26px] mt-[2px]"></i>
              <p class="tracking-wide mt-[4px]">Kalender</p>
            </router-link>
          </li>
          <li>
            <router-link to="/directory" active-class="bg-gray-800" class="flex hover:bg-gray-800 py-2 px-7 flex-col items-center text-xs hover-transition font-light justify-center">
              <i class="fa-solid fa-users-rectangle text-[26px] mt-[2px]"></i>
              <p class="tracking-wide mt-[4px]">Kartotek</p>
            </router-link>
          </li>
        </ul>
      </nav>

      <router-link to="/" active-class="bg-gray-800" class="text-gray-200 font-inter text-center font-normal flex hover:bg-gray-800 h-full py-4 px-7 flex-col items-center text-sm hover-transition font-light justify-center">
        <div class="capitalize leading-none">{{ auth.user.name }}</div>
        <i class="fa-solid fa-sort-down text-xl leading-none"></i>
      </router-link>
    </div>
  </div>
</template>

<script setup>
  import router from "@/router";
  import { Auth } from "@/store/auth";
  const auth = Auth();

  const logout = () => {
    auth.logout();
  }
</script>