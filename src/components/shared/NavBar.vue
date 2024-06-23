<template>
    <!-- <h1>Welcome {{ name }}</h1> -->
    <nav class="bg-black_two p-2 flex justify-between items-center">
        <div class="flex gap-3 items-center">
            <img class="w-[50px] h-[50px] rounded-full" src="../../assets/logo.png" alt="">
            <h3 class="text-gray-300 text-xl">Attendance System</h3>
        </div>

        <div class="flex items-center gap-3">
            <h2 class="text-white text-lg font-semibold tracking-wide md:block hidden">{{ name }}</h2>
            <img v-if="photo" ref="img_element" class="w-[50px] h-[50px] rounded-full" :src="photo" alt="No profile photo">

        </div>
    </nav>
</template>

<script>
export default {
    props: ['name', 'photo'],

    data() {
        return {
            photoLoaded: false,
        }
    },
}
</script>