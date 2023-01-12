<template>
    <div class="flex flex-col bg-primary items-center justify-center h-screen w-full">
      <router-link to="/" class="text-white mb-3 underline font-inter">Gå tilbage</router-link>
      <div class="w-[1000px] flex bg-white">
          <div class="w-1/2 bg-green-100 p-12">
            <img src="@/assets/images/logo_primary.png" class="w-16"/>
            <div class="flex items-center justify-center h-full">
              <div>
                <img src="@/assets/images/login_calendar.png" class="w-[200px] mx-auto"/>
                <h3 class="text-center text-gray-700 mt-5 font-inter text-lg font-bold w-10/12 mx-auto">Hold styr på alle dine opgaver, medarbejder og meget mere...</h3>
              </div>
            </div>
          </div>
          <div class="w-1/2 p-12">
            <div class="flex items-center justify-end text-gray-400 text-sm font-light font-inter">
              <router-link to="/register" class="border border-gray-400 px-4 py-2 rounded-full -mt-1 hover-transition hover:bg-gray-400 hover:text-white">Tilmeld dig gratis</router-link>
            </div>

            <h1 class="text-3xl font-inter font-bold mt-10 leading-none">Log på Kal2</h1>
            <p class="font-inter font-light text-sm mt-1 text-gray-600">Velkommen tilbage</p>

            <form method="post" @submit.prevent="submit" class="mt-10">
              <p class="font-inter text-gray-800 text-sm">Din email</p>
              <input type="text" name="email" v-model="email" id="login_email" autocomplete="email" class="w-full border mt-[2px] border-gray-300 rounded-md shadow h-10 pl-2 focus:outline-primary" />
              <p class="font-inter text-gray-800 mt-8 text-sm">Din adgangskode</p>
              <input type="password" v-model="password" autocomplete="current-password" name="password" id="login_password" class="w-full border mt-[2px] border-gray-300 rounded-md shadow h-10 pl-2 focus:outline-primary" />
              <button type="submit" name="submit" id="submit" class="bg-primary px-10 py-3 rounded-full font-inter font-medium text-lg shadow-md mt-10 text-white hover-transition hover:shadow-xl hover:bg-primary/90">Log ind</button>
              <p class="text-gray-400 text-sm font-light font-inter mt-10 underline hover-transition hover:text-gray-800 pb-10">Glemt din adgangskode?</p>
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

  const submit = async () => {
    const response = await axios.post('/login', {
      email: email.value,
      password: password.value,
    });
    auth.login(response.data.access_token, response.data.user);
    await router.push({ path: '/dashboard' });
  };
</script>