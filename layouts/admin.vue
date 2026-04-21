<template>
  <v-layout>
    <AdminHeader />
     <LoadingApp />
    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>
