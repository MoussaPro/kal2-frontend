<template>
    <div class="flex flex-col bg-gray-700 items-center justify-center h-screen px-3 lg:px-0 w-full">
      <router-link to="/"><img src="@/assets/images/logo_white.png" alt="white logo" class="w-20 mt-10 mb-3 lg:hidden"/></router-link>

      <div class="lg:w-[1000px] lg:flex rounded-md shadow-md lg:rounded-none lg:shadow-none">
          <div class="hidden lg:block lg:w-1/2 bg-gray-200 p-12">
            <router-link to="/"><img alt="black logo" src="@/assets/images/logo_black.png" class="w-16 hover:opacity-75"/></router-link>
            <div class="flex flex-col items-center justify-center h-full">
              <img src="@/assets/images/login_calendar.png" class="w-[200px] mx-auto"/>
              <h3 class="text-center text-gray-700 mt-5 font-inter text-lg font-bold w-10/12 mx-auto">Hold styr på alle dine opgaver, medarbejder og meget mere...</h3>
            </div>
          </div>
          <div class="lg:w-1/2 relative p-3 rounded-md lg:rounded-none text-center lg:text-left shadow-md lg:shadow-none lg:p-12 bg-white">
            <h1 class="text-3xl font-inter font-bold mt-10 leading-none">Velkommen tilbage</h1>
            <p class="font-inter font-light text-sm mt-1 text-gray-600">Log på kal2</p>

            <transition tag="slide-fade">
              <div class="bg-red-500 text-left rounded-md shadow-md mt-5 -mb-5 pl-4 pr-10 py-2 text-white font-inter lg:absolute top-[10px] font-medium text-sm flex items-center hover-transition" v-if="error">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 mr-2">
                  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
                </svg>
                Forkert email eller adgangskode, prøv venligst igen.
              </div>
            </transition>

            <form method="post" @submit.prevent="submit" class="mt-10 text-left">
              <p class="font-inter text-gray-800 text-sm">Din email</p>
              <input type="text" name="email" v-model="email" id="login_email" autocomplete="email" class="w-full border mt-[2px] border-gray-300 rounded-md shadow h-10 pl-2 focus:outline-primary" />
              <p class="font-inter text-gray-800 mt-8 text-sm">Din adgangskode</p>
              <input type="password" v-model="password" autocomplete="current-password" name="password" id="login_password" class="w-full border mt-[2px] border-gray-300 rounded-md shadow h-10 pl-2 focus:outline-primary" />
              <button type="submit" name="submit" id="submit" class="bg-primary px-10 w-full lg:w-auto py-3 rounded-md lg:rounded-full font-inter font-medium text-lg shadow-md mt-10 text-white hover-transition " :class="{'hover:shadow-xl hover:bg-primary/90': !loading}" :disabled="loading">
                <span v-if="!loading">Log ind</span>
                <span v-if="loading">Logger ind...</span>
              </button>
              <p class="text-gray-600 text-sm font-light font-inter mt-10 underline hover-transition hover:text-gray-800 lg:pb-10 cursor-pointer">Glemt din adgangskode?</p>
            </form>
          </div>
      </div>
    </div>
</template>

<script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { Auth } from "@/store/auth";
  const auth = Auth();

  const email = ref('');
  const password = ref('');
  const router = useRouter();
  const loading = ref(false);
  const error = ref();

  const submit = async () => {
    error.value = false;
    loading.value = true;

    await axios.post('/login', {
      email: email.value,
      password: password.value,
    }).then((response) => response.data).then((response) => {
      if (response && !response.wrong) {
        auth.login(response.access_token, response.user);
        router.push({ path: '/dashboard' });
      } else {
        error.value = response.message;
      }

      loading.value = false;
    }).catch((e) => {
      loading.value = false;
      error.value = 'Der opstod en fejl, kontakt venligst support med fejl: ' +e.code;
    });
  };
</script>