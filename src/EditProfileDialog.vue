<template>
    <v-dialog
        v-model="value"
        max-width="500px"
    >
            <v-card class="textTitle">
                <v-toolbar flat dense dark color="#BCAAA4">
                    <v-toolbar-title class="toolbarTitle"> <v-icon>mdi-account</v-icon> Edit Account</v-toolbar-title>
                    <v-spacer/>
                    <v-icon @click="close()">mdi-close</v-icon>
                </v-toolbar>
                <v-card-text>
                    <br/>
                    <v-form
                        ref="form"
                        v-model="valid"
                        lazy-validation
                        class="textTitle"
                    >
                        <v-text-field :rules="nameRules" prepend-icon="mdi-account" label="Username" dense rounded outlined readonly filled v-model="editObj.username"></v-text-field>
                        <v-text-field :append-icon="!show ? ' mdi-eye-off' : ' mdi-eye'" :rules="nameRules" :type="show ? 'text' : 'password'"  prepend-inner-icon="mdi-key" label="Password" dense rounded outlined  v-model="password" @click:append="show=!show"></v-text-field>
                        <v-text-field :append-icon="!show1 ? ' mdi-eye-off' : ' mdi-eye'" :rules="nameRules" :type="show ? 'text' : 'password'"   prepend-inner-icon="mdi-key" label="Confirm Password" dense rounded outlined  v-model="confirm_password" @click:append="show1=!show1"></v-text-field>
                        <!-- @click:append="searchTransaction" -->
                        <v-card-actions>
                            <v-spacer/>
                            <v-btn dark color="#BCAAA4" v-if="valid" @click="updateAccount()"> <v-icon>mdi-account</v-icon> Update Account </v-btn>
                        </v-card-actions>
                </v-form>
                    </v-card-text>
            </v-card>
    </v-dialog>

</template>
<script>
import Swal from 'sweetalert2';
import Accounts from './class/accounts';
export default {
    props: ['dialog', 'saveObj'],
    data: () => ({
        classAccount: new Accounts(),
        show: false, 
        show1:false , 
       password: "",
        confirm_password: "", 
       nameRules: [
            v => !!v || 'This field is required'
        ],
         valid: false,
    }),
    computed: {
        value() {
            return this.dialog
        },
        editObj() {
            return this.saveObj
        }
    },
    methods: {
        async updateAccount() {
            if (this.$refs.form.validate()) { 
            if (this.confirm_password.toUpperCase() !== this.password.toUpperCase()) {
                Swal.fire({
                        toast: true,
                        position:'bottom-end',
                        title: `Password and Confirm Password Not Matched`,
                        icon: "error",
                        timer: 1000,
                        showConfirmButton:false
                })
                return false 
            }
             Swal.fire({
                title: `Are you want to update this account ?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Yes, update it!`,
             }).then(async (result) => {
                 if (result.isConfirmed) { 
                      this.editObj.password = this.password
                        await this.classAccount.updateAccountPassword(this.editObj).then(() => { 
                             Swal.fire({
                                    toast: true,
                                    position:'bottom-end',
                                    title: `Password successfully updated`,
                                    icon: "success",
                                    timer: 1000,
                                    showConfirmButton:false
                            })
                            this.close()
                        })

                 }
             })
          }
        },
        close() {
            this.$emit('closeDialog', false )
        }
    }
}
</script>