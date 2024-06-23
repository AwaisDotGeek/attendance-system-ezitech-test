<template>
    <NavBar />
    <div class="p-5">
        <h2 class="text-lg font-semibold text-gray-300 mb-3">
            Welcome to Admin's Portal
        </h2>

        <div class="md:p-2 py-2 grid grid-flow-row md:grid-cols-2 grid-cols-1 md:gap-3 gap-1.5">
            <button
                class="btn shadow-md shadow-black_three bg-gradient-to-tr from-black_four via-black_two to-black_four hover:shadow-lg hover:shadow-black_three"
                @click="showEnrolledStudents">
                Enrolled Students
            </button>
            <button
                class="btn shadow-md shadow-black_three bg-gradient-to-br from-black_four via-black_two to-black_four hover:shadow-lg hover:shadow-black_three"
                @click="showLeaveApplicatons">
                Leave Applications
            </button>
        </div>

        <!-- Show Enroll Students -->
        <div v-if="viewingEnrolledStudents && enrolledStudents.length" class="md:px-2 md:mt-3">
            <div class="mt-2">
                <ul>
                    <li class="bg-black_four text-gray-300 px-5 py-2 mb-1 rounded-md grid grid-flow-col grid-cols-3">
                        <span>
                            Student ID
                        </span>
                        <span>
                            Student Name
                        </span>
                        <span>
                            Attendance Grade
                        </span>
                    </li>
                    <li v-for="(student, index) in enrolledStudents" :key="student._id" class="flex gap-2">
                        <div @click="() => { this.getAttendanceDetails(student._id); this.studentIndexToShow = index; }"
                            class="w-full bg-black_three text-gray-300 mb-1 px-5 py-2 rounded-md cursor-pointer hover:shadow-md hover:shadow-black_four active:shadow-none">
                            <div class="grid grid-flow-col md:grid-cols-3 grid-cols-4">
                                <span>
                                    {{ student.studentId }}
                                </span>
                                <span class="md:col-span-1 col-span-2">
                                    {{ student.username }}
                                </span>
                                <span
                                    :class="{ 'bg-green-700': student.attendanceGrade === 'A', 'bg-blue-700': student.attendanceGrade === 'B', 'bg-yellow-700': student.attendanceGrade === 'C', 'bg-orange-700': student.attendanceGrade === 'D', 'bg-red-700': student.attendanceGrade === 'F' }"
                                    class="w-max px-1.5 rounded-full">
                                    {{ student.attendanceGrade }}
                                </span>
                            </div>

                            <!-- Student Details -->
                            <div v-if="index === studentIndexToShow"
                                class="py-5 mt-5 border-t-[1px] border-gray-400 flex md:flex-row flex-col gap-5">
                                <span>
                                    <img class="w-[150px] h-[150px] rounded-md" :src="student.photo_path"
                                        :alt="student.photo_path">
                                </span>
                                <div class="flex items-center">
                                    <span>
                                        Presents: {{ presents }}<br />
                                        Leaves: {{ leaves }}<br />
                                        Absents: {{ absents }}<br />
                                        Pending: {{ pending }}<br />
                                    </span>
                                    <span class="self-center ml-10 flex flex-col gap-2">
                                        <button
                                            @click="() => { this.isEditingAttendance = true;  this.indexToEditAttendance = index }"
                                            class="p-2 rounded-md shadow-sm shadow-black_one bg-gradient-to-tr from-black_four via-black_two to-black_four hover:shadow-md hover:shadow-black_one active:shadow-none">
                                            Edit Attendance</button>
                                        <button
                                            @click="() => { this.showReport = true; this.indexToShowReport = index; }"
                                            class="p-2 rounded-md w-full shadow-sm shadow-black_one bg-gradient-to-tr from-black_four via-black_two to-black_four hover:shadow-md hover:shadow-black_one active:shadow-none">Create
                                            Report</button>
                                        <button
                                            class="p-2 rounded-md shadow-sm shadow-black_one bg-gradient-to-tr from-black_four via-black_two to-black_four hover:shadow-md hover:shadow-black_one active:shadow-none">Create
                                            a ranged report</button>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <span v-if="index === studentIndexToShow" @click="() => { this.studentIndexToShow = -1 }"
                            class="text-gray-200 cursor-pointer rotate-45 bg-red-700 w-max px-2 rounded-full self-start text-lg">
                            +
                        </span>

                        <!-- Edit attendance -->
                        <div v-if="isEditingAttendance && index === indexToEditAttendance"
                            class="text-gray-300 w-full h-full flex justify-center items-center absolute top-0 left-0">
                            <div class="relative bg-black_two p-5 rounded-md shadow-lg shadow-black_four min-w-[300px]">
                                <h2 class="text-lg font-semibold text-center mb-8">Edit Attendance</h2>

                                <h3 class="mb-5">
                                    Click on attendance to mark as Present 
                                </h3>
                                <div class="grid grid-flow-row grid-cols-5 gap-8">
                                    <span v-for="attendance in student.attendances" :key="attendance._id">
                                        <span
                                            :class="{ 'bg-green-700': attendance.status.startsWith('p'), 'bg-yellow-600': attendance.status.startsWith('w'), 'bg-red-700': attendance.status.startsWith('a'), 'bg-blue-600': attendance.status.startsWith('l') }"
                                            class="px-4 py-3 rounded-full cursor-pointer"
                                            @click="markAsPresent(attendance)"
                                            >
                                            {{ attendance.status[0].toUpperCase() }}
                                        </span>
                                    </span>
                                </div>

                                <div class="mt-3">
                                    <span class="font-bold">Attendance grade: <span class="font-semibold">{{
                                            student.attendanceGrade
                                            }}</span></span>
                                </div>
                                <span v-if="isEditingAttendance && index === indexToEditAttendance"
                                    @click="() => { this.isEditingAttendance = false; }"
                                    class="absolute top-2 right-2 cursor-pointer rotate-45 bg-red-700 w-max px-2 rounded-full self-start text-lg">
                                    +
                                </span>
                            </div>
                        </div>

                        <!-- Show report -->
                        <div v-if="showReport && index === indexToShowReport"
                            class="text-gray-300 w-full h-full flex justify-center items-center absolute top-0 left-0">
                            <div class="relative bg-black_two p-5 rounded-md shadow-lg shadow-black_four">
                                <h2 class="text-lg font-semibold text-center mb-8">Attendance Report</h2>
                                <div class="flex gap-2">
                                    <img class="w-[80px] h-[80px] rounded-sm" :src=student.photo_path alt="">
                                    <div class="flex flex-col gap-1">
                                        <span>{{ student.username }}</span>
                                        <span>{{ student.studentId }}</span>
                                        <span>{{ student.email }}</span>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <span>Attendance grade: <span class="font-semibold">{{ student.attendanceGrade
                                            }}</span></span>
                                </div>
                                <span v-if="showReport && index === indexToShowReport"
                                    @click="() => { this.showReport = false; }"
                                    class="absolute top-2 right-2 cursor-pointer rotate-45 bg-red-700 w-max px-2 rounded-full self-start text-lg">
                                    +
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="viewingEnrolledStudents && !enrolledStudents.length">
            <h2 class="text-center text-lg text-gray-300">There are no enrolled students.</h2>
        </div>

        <!-- Show Leave Applications -->
        <div v-if="viewingLeaveApplications && leaveApplications.length > 0" class="md:px-2 md:mt-3">
            <ul>
                <li class="bg-black_four text-gray-300 px-5 py-2 mb-1 rounded-md grid grid-flow-col grid-cols-3">
                    <span>
                        Student ID
                    </span>
                    <span>
                        Student name
                    </span>
                    <span>
                        Leave subject
                    </span>
                </li>
                <li v-for="(application, index) in leaveApplications" :key="application._id" class="flex gap-2">
                    <div @click="showLeaveBody(index)"
                        class="w-full bg-black_three text-gray-300 mb-1.5 px-5 py-2 rounded-md grid grid-flow-rows grid-cols-3 cursor-pointer hover:shadow-md hover:shadow-black_four active:shadow-none">
                        <span>
                            {{ application.userId.studentId }}
                        </span>
                        <span>
                            {{ application.userId.username }}
                        </span>
                        <span class="bg-green-700 w-max px-2 rounded-full">
                            {{ application.subject }}
                        </span>

                        <!-- Leave Body -->
                        <div class="col-span-3 mt-3 border-t-[1px] border-gray-300 pt-2"
                            :class="{ 'flex flex-col gap-2': index === leaveIndexToShow, 'hidden': index !== leaveIndexToShow }">
                            <div class="flex gap-2">
                                <span class="whitespace-nowrap">
                                    Leave Body:
                                </span>
                                <span class="tracking-wide">
                                    {{ application.body }}
                                </span>
                            </div>
                            <div class="flex gap-3">
                                <span @click="declineApplication(application)"
                                    class="btn w-full mb-1 text-center shadow-sm shadow-black_five bg-gradient-to-b from-black_four to to-black_three hover:shadow-md hover:shadow-black_five">
                                    Decline
                                </span>
                                <span @click="approveApplication(application)"
                                    class="btn w-full mb-1 text-center shadow-sm shadow-black_five bg-gradient-to-b from-black_four to to-black_three hover:shadow-md hover:shadow-black_five">
                                    Approve
                                </span>
                            </div>
                        </div>
                    </div>

                    <span v-if="index === leaveIndexToShow" @click="showLeaveBody('-1')"
                        class="cursor-pointer rotate-45 bg-red-700 w-max px-2 rounded-full self-start text-lg">
                        +
                    </span>
                </li>
            </ul>
        </div>
        <div v-if="viewingLeaveApplications && leaveApplications.length === 0" class="p-5">
            <h2 class="text-center text-lg text-gray-300">There are no pending applications.</h2>
        </div>
    </div>
</template>

<script>
import NavBar from '../shared/NavBar.vue';
import axios from 'axios';

export default {
    components: {
        NavBar,
    },

    data() {
        return {
            enrolledStudents: [],
            viewingEnrolledStudents: true,

            leaveApplications: [],
            viewingLeaveApplications: false,

            leaveIndexToShow: -1,
            studentIndexToShow: -1,

            // Edit Attendance
            indexToEditAttendance: '',
            isEditingAttendance: false,

            // attendance details
            presents: '',
            absents: '',
            leaves: '',
            pending: '',

            showReport: false,
            indexToShowReport: -1,
        }
    },

    created() {
        this.getEnrolledStudents();
    },

    methods: {
        showEnrolledStudents() {
            this.getEnrolledStudents();
            this.viewingLeaveApplications = false;
            this.viewingEnrolledStudents = true;
        },

        showLeaveApplicatons() {
            this.getLeaveApplications();
            this.viewingEnrolledStudents = false;
            this.viewingLeaveApplications = true;
        },

        showLeaveBody(index) {
            this.leaveIndexToShow = index;
        },

        async getEnrolledStudents() {
            try {
                this.enrolledStudents = [];
                const response = await axios.get('http://localhost:5000/api/auth/getUsers');
                if (response && response.data) {
                    let temp = response.data;
                    for (let i = 0; i < temp.length; i++) {
                        let user = temp[i];
                        let presents = temp[i].attendances.reduce((acc, attendance) => {
                            return acc + (attendance.status === 'present' ? 1 : 0);
                        }, 0);

                        let presentsPercenage = (presents / temp[i].attendances.length) * 100;
                        user.attendanceGrade = presentsPercenage >= 86.67 ? 'A' : presentsPercenage >= 70 && presentsPercenage < 86.67 ? 'B' : presentsPercenage >= 50 && presentsPercenage < 70 ? 'C' : presentsPercenage >= 33 && presentsPercenage < 50 ? 'D' : 'F';
                        user.attendances = temp[i].attendances;
                        this.enrolledStudents.push(user);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        },

        async getLeaveApplications() {
            try {
                const response = await axios.get('http://localhost:5000/api/attendance/getLeaves');
                this.leaveApplications = response.data;
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        },

        async declineApplication(application) {
            try {
                const response = await axios.post('http://localhost:5000/api/attendance/declineLeave', {
                    leaveId: application._id,
                    date: application.date,
                });
                console.log(response);
                if (response && response.status === 201) {
                    this.showLeaveApplicatons();
                }
            } catch (error) {
                console.log("Failed to decline Application!");
            }
        },

        async approveApplication(application) {
            try {
                const response = await axios.post('http://localhost:5000/api/attendance/approveLeave', {
                    leaveId: application._id,
                    date: application.date,
                });
                console.log(response);
                if (response && response.status === 201) {
                    this.showLeaveApplicatons();
                }
            } catch (error) {
                console.log("Failed to decline Application!");
            }
        },

        async getAttendanceDetails(userId) {
            this.presents = 0;
            this.absents = 0;
            this.leaves = 0;
            this.pending = 0;
            try {
                const response = await axios.get(`http://localhost:5000/api/attendance/getRecord/${userId}`);
                // console.log(response);
                if (response && response.data) {
                    let temp = response.data;
                    temp.forEach(record => {
                        record.status == 'present' ? this.presents++ :
                            record.status == 'leave' ? this.leaves++ :
                                record.status == 'absent' ? this.absents++ :
                                    record.status == 'pending' ? this.pending++ : '';
                    });
                }
            } catch (error) {
                console.log(error);
            }
        },

        async markAsPresent(attendance) {
            if (attendance.status.startsWith('p')) {
                return;
            }

            try {
                const response = await axios.post('http://localhost:5000/api/attendance/mark-present', {
                    _id: attendance._id,
                    date: attendance.date,
                });

                if (response && response.status === 200) {
                    this.getAttendanceDetails(attendance.userId);
                    this.getEnrolledStudents();
                }
            } catch (error) {
                console.log(error);
            }
        },
    }
}
</script>