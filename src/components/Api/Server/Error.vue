<template>
  <div>
    <div class="w-full mt-10 bg-gray-200 px-10 py-[100px] flex items-center justify-center">
      <div>
        <img src="@/assets/images/error.png" class="w-32 mx-auto" alt="Error icon"/>
        <h2 class="text-gray-500 text-[30px] mt-10 text-center">Der opstod en teknisk fejl</h2>
        <h3 class="text-gray-500 text-[14px] mt-2 text-center">Prøv venligst at genindlæse hjemmesiden. Opstår dette problem stadig, kontakt venligst vores support.</h3>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { Auth } from "@/store/auth";

  const props = defineProps({
    error: Object
  });
  // If unauthorized, log user out.
  if (props.error && props.error.response && props.error.status && props.error.response.status === 403 && props.error.response.data.error === 'Unauthorized') {
    const auth = Auth();

    auth.logout();
  }
</script>