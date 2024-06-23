<template>
    <main class="w-full h-full flex justify-center items-center">
        <div>
            <div class="relative rounded-lg overflow-hidden shadow-lg shadow-black_five">
                <img class="md:block hidden" src="../../assets/logo.png" alt="">

                <!-- Form -->
                <div
                    class="bg-black_two md:w-[50%] w-full h-full md:absolute static top-0 left-0 md:p-0 p-10 flex flex-col justify-center items-center gap-10">
                    <h2 class="text-3xl text-white font-bold tracking-wide">LOGIN</h2>
                    <div class="flex justify-center items-center]">
                        <form @submit.prevent="login" class="flex flex-col items-center gap-2">
                            <input v-model="idOrEmail" type="text" placeholder="Student ID or Email">
                            <input v-model="password" type="password" placeholder="Password">
                            <input
                                class="bg-black_four text-white tracking-wide p-2 md:mt-1 mt-3 md:w-full w-[70%] rounded-lg cursor-pointer shadow-sm shadow-gray-700 hover:shadow-md hover:shadow-black_five active:mt-2"
                                type="submit"
                                value="Login">
                        </form>
                    </div>
                    <span class="mt-[-14px]">
                        <RouterLink to="/signup" class="text-gray-300">
                            Register instead
                        </RouterLink>
                    </span>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            idOrEmail: '',
            password: '',
        }
    },

    methods: {
        async login() {
            if (this.idOrEmail === 'admin' && this.password === 'admin') {
                this.$router.push('/admin-panel');
                return;
            }

            try {
                const response = await axios.post('http://localhost:5000/api/auth/login', {
                    idOrEmail: this.idOrEmail,
                    password: this.password
                })

                if (response && response.data.token) {
                    localStorage.setItem('jwt', response.data.token);
                    this.$router.push('/user-panel');
                }
            } catch (error) {
                console.log(`An error has occured while trying to sign in ${error}`)
            }
            
        }
    }
}
</script>

<style scoped>
input[type="text"], input[type="password"]{
    padding: 5px;
    background: none;
    border-bottom: 0.5px solid white;
    outline: none;
    color: white;
    letter-spacing: 0.3px;
}

input[type="text"]:focus {
    border-bottom: 1px solid white;
}
</style>