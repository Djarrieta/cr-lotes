<template>
<div>
  <div class="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <form class="mt-8" action="#" method="POST">
        <!-- Inputs -->
        <div class="rounded-md shadow-sm">
          <div>
            <input v-model="titulo" type="text" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="TITULO">
          </div>
          <div class="-mt-px">
            <input v-model="phoneNumber" aria-label="phoneNumber" name="phoneNumber" type="text" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="WhatsApp">
          </div>
          <div class="-mt-px">
            <input v-model="email" aria-label="Email address" name="email" type="email" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Correo">
          </div>

          <div class="-mt-px">
            <input v-model="password" name="password" type="password" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Contraseña">
          </div>
          <div class="-mt-px">
            <input v-model="password2" aria-label="Password2" name="password2" type="password" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" placeholder="Repite tu contraseña">
          </div>
        </div>
        
        <!-- Problems -->
        <p v-if="problems" class="bg-red-300 w-full text-red-600 text-xs my-2 p-2 rounded-sm">
          {{ problems }}
        </p>

        <!-- SignUp button -->
        <div class="mt-4">
          <div @click="signUp" class=" cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            Registrarse
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<script>
export default {
    name:"Step1",
    props:{}
}
</script>