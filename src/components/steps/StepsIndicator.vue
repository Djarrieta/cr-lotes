<template>
<!-- component -->
<div class="w-full py-4">
  <div class="flex">
     <!-- step 1 Titulo-->
    <div class="w-1/4">
      <div class="relative mb-2">
        <!-- circle -->
        <div class="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center" 
        :class="indicator>=1 ? 'bg-primary ' : 'none'">
          <span class="text-center  w-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
      </div>
    </div>

     <!-- step 2 Ubicación-->
    <div class="w-1/4">
      <div class="relative mb-2">
        <div class="absolute flex align-center items-center align-middle content-center" style="width: calc(100% - 2.5rem - 1rem); top: 50%; transform: translate(-50%, -50%)">
          <div class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
            <!-- bar -->
            <div class="w-full bg-white py-1 rounded" 
            :class="indicator>=2 ? 'bg-primary' : 'none'"></div>
          </div>
        </div>
        <!-- circle -->
        <div class="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center" 
        :class="indicator>=2 ? 'bg-primary' : 'none'">
          <span class="text-center text-gray-600 w-full p-1">
            <!-- icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
        </div>
      </div>
    </div>
     <!-- step 3 Tipo frente-->
    <div class="w-1/4">
      <div class="relative mb-2">
        <div class="absolute flex align-center items-center align-middle content-center" style="width: calc(100% - 2.5rem - 1rem); top: 50%; transform: translate(-50%, -50%)">
          <div class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
            <!-- bar -->
            <div class="w-full bg-white py-1 rounded" 
            :class="indicator>=3 ? 'bg-primary' : 'none'"></div>
          </div>
        </div>
        <!-- circle -->
        <div class="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center" 
        :class="indicator>=3 ? 'bg-primary' : 'none'">
          <span class="text-center text-gray-600 w-full p-1">
            <!-- icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </span>
        </div>
      </div>
    </div>
     <!-- step 4 inclination-->
    <div class="w-1/4">
      <div class="relative mb-2">
        <div class="absolute flex align-center items-center align-middle content-center" style="width: calc(100% - 2.5rem - 1rem); top: 50%; transform: translate(-50%, -50%)">
          <div class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
            <!-- bar -->
            <div class="w-full bg-white py-1 rounded" 
            :class="indicator>=4 ? 'bg-primary' : 'none'"></div>
          </div>
        </div>
        <!-- circle -->
        <div class="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center" 
        :class="indicator>=4 ? 'bg-primary' : 'none'">
          <span class="text-center text-gray-600 w-full p-1">
            <!-- icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </div>
     <!-- step 5 nivel-->
    <div class="w-1/4">
      <div class="relative mb-2">
        <div class="absolute flex align-center items-center align-middle content-center" style="width: calc(100% - 2.5rem - 1rem); top: 50%; transform: translate(-50%, -50%)">
          <div class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
            <!-- bar -->
            <div class="w-full bg-white py-1 rounded" 
            :class="indicator>=5 ? 'bg-primary' : 'none'"></div>
          </div>
        </div>
        <!-- circle -->
        <div class="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center" 
        :class="indicator>=5 ? 'bg-primary' : 'none'">
          <span class="text-center text-gray-600 w-full p-1">
            <!-- icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </span>
        </div>
      </div>
    </div>
     <!-- step 6 comodidades-->
    <div class="w-1/4">
      <div class="relative mb-2">
        <div class="absolute flex align-center items-center align-middle content-center" style="width: calc(100% - 2.5rem - 1rem); top: 50%; transform: translate(-50%, -50%)">
          <div class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
            <!-- bar -->
            <div class="w-full bg-white py-1 rounded" 
            :class="indicator>=6 ? 'bg-primary' : 'none'"></div>
          </div>
        </div>
        <!-- circle -->
        <div class="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center" 
        :class="indicator>=6 ? 'bg-primary' : 'none'">
          <span class="text-center text-gray-600 w-full p-1">
            <!-- icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
        </div>
      </div>
    </div>
    <!-- step 7 Documents-->
    <div class="w-1/4">
      <div class="relative mb-2">
        <div class="absolute flex align-center items-center align-middle content-center" style="width: calc(100% - 2.5rem - 1rem); top: 50%; transform: translate(-50%, -50%)">
          <div class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
            <!-- bar -->
            <div class="w-full bg-white py-1 rounded" 
            :class="indicator>=7 ? 'bg-primary' : 'none'"></div>
          </div>
        </div>
        <!-- circle -->
        <div class="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center" 
        :class="indicator>=7 ? 'bg-primary' : 'none'">
          <span class="text-center text-gray-600 w-full p-1">
            <!-- icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </span>
        </div>
      </div>
    </div>
    <!-- step 8 pictures-->
    <div class="w-1/4">
      <div class="relative mb-2">
        <div class="absolute flex align-center items-center align-middle content-center" style="width: calc(100% - 2.5rem - 1rem); top: 50%; transform: translate(-50%, -50%)">
          <div class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
            <!-- bar -->
            <div class="w-full bg-white py-1 rounded" 
            :class="indicator>=8 ? 'bg-primary' : 'none'"></div>
          </div>
        </div>
        <!-- circle -->
        <div class="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center" 
        :class="indicator>=8 ? 'bg-primary' : 'none'">
          <span class="text-center text-gray-600 w-full p-1">
            <!-- icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
        </div>
      </div>
    </div>


  </div>
</div>
</template>

<script>
export default {
    name:"stepsIndicator",
    props:["indicator"]
}
</script>

