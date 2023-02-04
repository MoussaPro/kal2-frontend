<template>
  <div class="w-full border-b border-gray-800 bg-gray-700 px-2 lg:px-16 shadow-md">
    <div class="flex items-center justify-between">
      <router-link to="/dashboard" class="pr-10"><img src="@/assets/images/logo_white.png" class="w-[75px]" alt="white logo"/></router-link>

      <nav class="text-gray-200 flex-1 font-inter font-normal hidden lg:block">
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

      <div class="items-center gap-x-3 hidden lg:flex">
          <div class="flex items-center">
            <div @click="toggleSearch" :class="searchActive ? 'rounded-l-md bg-gray-800 hover:bg-gray-700' : 'bg-[#434d60] rounded-md hover:bg-gray-800 mr-2'" class="flex py-2 px-3 cursor-pointer flex-col items-center text-xs hover-transition font-light justify-center text-gray-200 font-inter font-normal">
              <i class="fa-solid fa-magnifying-glass text-[26px] mt-[2px]" v-if="!searchActive"></i>
              <i class="fa-solid fa-x text-[26px] mt-[2px]" v-else></i>
            </div>
            <transition name="searchSlide" class="overflow-hidden">
              <form method="get" class="flex items-center mr-2" id="searchForm" action="/dashboard" @submit.prevent="search()" v-if="searchActive">
                <input type="text" ref="searchInput" class="text-black py-[8.5px] w-[250px] pl-2 border focus:outline-0 border-gray-800" name="q" placeholder="Indtast søgeord" v-model="searchTerm"/>
                <button @click="search()" class="py-[8.5px] block bg-gray-900 text-white -ml-[1px] rounded-r-md px-3 border border-gray-900 hover:bg-gray-800 hover-transition hover:border-gray-800" >Søg</button>
              </form>
            </transition>
          </div>
      </div>
      <router-link to="/" active-class="bg-gray-800" class="text-gray-200 font-inter text-center font-normal flex hover:bg-gray-800 h-full py-4 lg:px-7 flex-col items-center text-sm hover-transition font-light justify-center">
        <div class="capitalize leading-none">{{ auth.user.name }}</div>
        <i class="fa-solid fa-sort-down text-xl leading-none"></i>
      </router-link>
    </div>
  </div>
</template>

<script setup>
  import { Auth } from "@/store/auth";
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  const auth = Auth();

  const logout = () => {
    auth.logout();
  }

  const searchActive = ref(false);
  const searchTerm = ref();
  const Router = useRouter();
  const searchInput = ref();

  const toggleSearch = () => {
    searchActive.value = !searchActive.value;
  }

  const hideSearch = () => {
    searchActive.value = false;
  }

  const search = () => {
    hideSearch();
    Router.push('/search?q='+searchTerm.value);
  }
</script>
<style>
.searchSlide-enter-active,
.searchSlide-leave-active {
  transition: all 0.3s ease;
}
.searchSlide-enter-from,
.searchSlide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>