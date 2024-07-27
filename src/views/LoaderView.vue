<template>
     <v-container fluid >
            <v-layout align-center justify-center>
                 <v-img
                  :aspect-ratio="16/9"
                 max-width="800"
                src="@/assets/scissor_loader.gif"
                ></v-img>

            </v-layout>
                <h1 class="text-center textTitle">LOADING {{  loadingText  }}</h1>
    </v-container>
</template>
<script>

export default {
    props: {
         loadingText:{
            type: String,
            required: false 
        },
    }
}
</script>

