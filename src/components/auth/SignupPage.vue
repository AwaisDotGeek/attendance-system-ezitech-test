<template>
    <main class="w-full h-full flex justify-center items-center">
        <div>
            <div class="relative rounded-lg overflow-hidden shadow-lg shadow-black_five">
                <img class="md:block hidden" src="../../assets/logo.png" alt="">

                <!-- Form -->
                <div
                    class="bg-black_two md:w-[50%] w-full h-full md:absolute static top-0 left-0 md:p-0 p-10 flex flex-col justify-center items-center gap-10">
                    <h2 class="text-3xl text-white font-bold tracking-wide">REGISTER</h2>
                    <div class="flex justify-center items-center">
                        <form @submit.prevent="register" class="flex flex-col items-center gap-2">
                            <input v-model="username" type="text" placeholder="Student Name" required />
                            <input v-model="studentId" type="text" placeholder="Student ID" required />
                            <input v-model="email" type="email" placeholder="Email address" required />
                            <!-- Custom file input -->
                            <label class="bg-black_three cursor-pointer rounded-sm text-white p-2 w-full"
                                @click="triggerFileInput">{{ choose_photo_label }}</label>
                            <input ref="fileInput" type="file" class="hidden" @change="handleFileChange"
                                accept="image/*">
                            <input v-model="password" type="password" placeholder="Password" required />
                            <input
                                class="bg-black_four text-white tracking-wide p-2 md:mt-5 mt-3 md:w-full w-[70%] rounded-lg cursor-pointer shadow-sm shadow-gray-700 hover:shadow-md hover:shadow-black_five active:mt-2"
                                type="submit"
                                value="Register">
                        </form>
                    </div>
                    <span class="mt-[-14px]">
                        <RouterLink to="/login" class="text-gray-300">
                            Login instead
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
            username: '',
            studentId: '',
            email: '',
            selectedPhoto: '',
            password: '',

            choose_photo_label: 'Choose Photo',
        }
    },    

    methods: {
        async register() {
            const formData = new FormData();
            formData.append('username', this.username);
            formData.append('studentId', this.studentId);
            formData.append('email', this.email);
            formData.append('password', this.password);
            formData.append('photo', this.selectedPhoto);

            await axios.post('http://localhost:5000/api/auth/register', formData, {
                header: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((response) => {
                    if (response.status === 201) {
                        this.$router.push('/login');
                    }
                 })
                .catch((error) => { console.log("An error has occured while posting the data! " , error); })

            console.log(formData);
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.choose_photo_label = 'Photo Selected';
                this.selectedPhoto = file;
            }
        },
    }
}
</script>

<style scoped>
input[type="text"],
input[type="password"],
input[type="email"] {
    padding: 5px;
    background: none;
    border-bottom: 0.2px solid white;
    outline: none;
    color: white;
    letter-spacing: 0.3px;
}

input[type="text"]:focus, 
input[type="password"]:focus,
input[type="email"]:focus
{
    border-bottom: 1px solid white;
}
</style>