<template>
    <div class="user-panel">
        <NavBar :name="user.username"
            :photo="user.photo_path && user.photo_path.replace('src', '').replace(`/`, '/')" />
        <div class="p-5">
            <div class="flex items-center justify-between">
                <h2 class="text-gray-300 md:text-xl text-lg font-bold mb-3 md:flex md:gap-1">
                    <span class="md:block hidden">Welcome to your</span>
                    Attendance Portal
                </h2>
                <h2 class="text-gray-300 md:text-lg font-bold mb-3">{{ today }}</h2>
            </div>
            <div class="md:p-2 py-2 grid grid-flow-row md:grid-cols-3 grid-cols-1 md:gap-3 gap-1.5">
                <button
                    class="btn shadow-md shadow-black_three bg-gradient-to-tr from-black_four via-black_two to-black_four hover:shadow-lg hover:shadow-black_three"
                    @click="markAttendance">
                    Mark Attendance
                </button>
                <button
                    class="btn shadow-md shadow-black_three bg-gradient-to-br from-black_four via-black_two to-black_four hover:shadow-lg hover:shadow-black_three"
                    @click="markLeave">
                    Mark Leave
                </button>
                <button
                    class="btn shadow-md shadow-black_three bg-gradient-to-tr from-black_four via-black_two to-black_four hover:shadow-lg hover:shadow-black_three"
                    @click="viewAttendance">
                    View Attendance
                </button>
            </div>

            <!-- Attendance Record -->
            <div v-if="attendanceRecords.length && !requestingLeave" class="md:p-2">
                <h3 class="text-gray-300 text-lg md:my-2 my-3 md:flex md:gap-1">
                    Attendance Record
                    <span class="md:block hidden">
                        (Year - Month - Day)
                    </span>
                </h3>
                <ul class="md:flex flex-wrap gap-2">
                    <li v-for="record in attendanceRecords" :key="record._id"
                        class="md:w-full mb-1 bg-black_three px-5 py-2 rounded-lg text-center lg:max-w-[500px] flex justify-between items-center">
                        <span class="text-gray-200 text-lg">
                            {{ record.date.replaceAll('-', ' - ') }}
                        </span>
                        <span
                            :class="{ 'bg-green-700': record.status.startsWith('p'), 'bg-yellow-600': record.status.startsWith('w'), 'bg-red-700': record.status.startsWith('a'), 'bg-blue-600': record.status.startsWith('l') }"
                            class="text-white font-semibold w-[45px] text-center py-2.5 rounded-full">
                            {{ record.status[0].toUpperCase() }}
                        </span>
                    </li>
                </ul>
            </div>

            <div v-if="showProfileEdit">
                <h3>Edit Profile Picture</h3>
                <form @submit.prevent="updateProfilePicture">
                    <input @change="onFileChange" type="file" accept="image/*" required />
                    <button type="submit">Update Picture</button>
                </form>
            </div>

            <!-- request leave -->
            <div class="flex md:flex-row flex-col-reverse md:justify-center md:items-start items-end md:p-5 pt-3 gap-3"
                v-if="requestingLeave">
                <div
                    class="p-3 flex justify-center bg-black_three md:max-w-[550px] w-full rounded-lg shadow-md shadow-black_four">
                    <form @submit.prevent="postLeave" class="flex flex-col gap-2 md:min-w-[500px] w-full">
                        <input type="text" required="true" v-model="leaveSubject"
                            class="bg-transparent py-2 tex-gray-200 border-b-[1.5px] border-gray-400 outline-none text-gray-300"
                            placeholder="Subject" />
                        <textarea type="text" rows="5" placeholder="Body" required="true" v-model="leaveBody"
                            class="bg-transparent resize-none outline-none text-gray-200"></textarea>
                        <input class="bg-black_four rounded-lg text-gray-300 py-1 cursor-pointer" type="submit">
                    </form>
                </div>
                <h2 @click="() => { requestingLeave = false; }"
                    class="text-4xl rotate-45 bg-red-900 max-h-max max-w-max px-3 py-1 rounded-full text-white shadow-md shadow-black_three hover:shadow-md hover:shadow-black_four active:mt-1 cursor-pointer">
                    +
                </h2>
            </div>

            <!-- View Attendance from range -->
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import NavBar from '../shared/NavBar.vue';

export default {
    components: {
        NavBar,
    },

    data() {
        return {
            isAuthenticated: false,
            loginForm: {
                idOrEmail: '',
                password: ''
            },
            registerForm: {
                username: '',
                studentId: '',
                email: '',
                password: '',
                profilePhoto: null
            },
            user: {},
            attendanceRecords: [],
            showProfileEdit: false,

            today: '',
            requestingLeave: false,
            leaveSubject: '',
            leaveBody: '',
        };
    },

    created() {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            this.isAuthenticated = true;
            this.getUserInfo();
        }
    },

    watch: {
        user() {
            if (this.user._id) {
                this.viewAttendance();
            }
        },
    },

    mounted() {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        this.today = formattedDate;
    },

    methods: {
        onFileChange(event) {
            this.registerForm.profilePhoto = event.target.files[0];
        },

        async getUserInfo() {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/user', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                console.log(response.data);
                this.user = response.data;
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        },

        async markAttendance() {
            try {
                // const today = this.getTodayDateForDB();

                await axios.post('http://localhost:5000/api/attendance/mark', {
                    userId: this.user._id,
                    date: '2024-6-24',
                    status: 'present',
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                this.viewAttendance();
                alert('Attendance marked.');
            } catch (error) {
                console.error('Failed to mark attendance:', error);
            }
        },

        markLeave() {
            this.requestingLeave = true;
        },

        async postLeave() {
            // const today = this.getTodayDateForDB();

            try {
                await axios.post('http://localhost:5000/api/attendance/request-leave', {
                    userId: this.user._id,
                    date: '2024-6-26',
                    leaveSubject: this.leaveSubject,
                    leaveBody: this.leaveBody,
                }, 
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                this.viewAttendance();
                alert('Leave Posted.');
                this.requestingLeave = false;
            } catch (error) {
                console.error('Failed to Post leave:', error);
            }
        },

        async viewAttendance() {
            try {
                const response = await axios.get(`http://localhost:5000/api/attendance/view/${this.user._id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                this.attendanceRecords = response.data;
                console.log(response.data);
            } catch (error) {
                console.error('Failed to fetch attendance records:', error);
            }
        },

        editProfilePicture() {
            this.showProfileEdit = true;
        },

        async updateProfilePicture() {
            const formData = new FormData();
            formData.append('photo', this.registerForm.profilePhoto);

            try {
                await axios.put('http://localhost:5000/api/auth/profile-photo', formData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                alert('Profile picture updated.');
                this.showProfileEdit = false;
            } catch (error) {
                console.error('Failed to update profile picture:', error);
            }
        },

        logout() {
            localStorage.removeItem('jwt');
            this.isAuthenticated = false;
            this.user = {};
            this.attendanceRecords = [];
        },

        getTodayDateForDB() {
            let today = new Date();
            // Get the year, month (0-indexed), day
            const year = today.getFullYear();
            const month = today.getMonth();
            const day = today.getDate();

            today = `${year}-${month + 1}-${day}`;

            return today;
        }
    },
};
</script>

<style>
.btn {
    padding: 15px;
    color: gainsboro;
    letter-spacing: 0.2px;
    border-radius: 5px;
}

.btn:active {
    box-shadow: none;
}
</style>
