<template>
    <main class="w-full h-full flex justify-center items-center">
        <div class="flex flex-col gap-10 shadow-md shadow-black_five p-5 rounded-lg">
            <div class="flex items-center gap-3">
                <img class="w-[80px] h-[80px] rounded-full" src="../assets/logo.png" alt="">
                <h3 class="md:text-2xl text-md text-gray-200">Welcome to Attendance System</h3>
            </div>

            <div class="flex gap-2">
                <a href="/login" class="w-full bg-black_four">
                    Login
                </a>
                <a href="/signup" class="w-full bg-black_five">
                    Register
                </a>
            </div>
        </div>
    </main>
</template>

<style scoped>
a {
    font-size: 16px;
    font-weight: bold;
    color: white;
    text-align: center;
    padding: 8px;
}
</style>