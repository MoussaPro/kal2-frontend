<template>
  <div class="relative">
    <div class="bg-gray-700 absolute w-full h-[400px] lg:h-[500px] top-0 left-0"></div>
      <div class="content">
        <div class="flex flex-col pt-5 lg:pt-10 -mt-1 items-center justify-center">
          <img src="@/assets/images/logo_white.png" alt="kal2 logo" class="w-24 mx-auto mb-5"/>
          <div class="text-2xl lg:text-4xl text-white font-inter font-bold mx-5 lg:mx-0 lg:tracking-[1.4px] lg:leading-[40px] text-center">Anden generations kalender & booking system</div>
          <div class="text-lg mx-5 lg:mx-0 lg:text-xl text-white font-inter font-normal text-center mt-2 lg:mt-0">Med fokus på dynamik, kartotek håndtering, opgaver og meget mere </div>
          <img src="@/assets/images/frontpage/banner.png" class="lg:w-9/12 mt-5" alt="macbook kal2"/>
        </div>

        <div class="lg:w-10/12 mx-auto mt-10">
          <div class="text-gray-700 text-2xl font-semibold">Hold mig opdateret</div>
          <div class="flex mt-2">
            <input type="text" class="flex-1 border border-gray-200 rounded-l-md h-10 lg:h-12 pl-2 focus:outline-none" placeholder="Din email adresse"/>
            <button class="bg-gray-700 text-white h-10 lg:h-12 rounded-r-md text-sm px-4 font-medium hover-transition hover:bg-gray-600">Tilmeld</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
  import { Auth } from "@/store/auth";
  const auth = Auth();
</script>