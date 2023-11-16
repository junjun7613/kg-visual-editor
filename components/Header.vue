<template>
		<!--<v-navigation-drawer v-model="drawer" app floating class="px-6 py-4">
            <v-list>
                <v-list-item v-for="item in items" active-color="primary" :to="item.path" class="py-3">
                    <v-icon :icon="item.icon" class="mr-6" />
                    <v-list-item-title class="font-weight-bold" v-text="item.title" />
                </v-list-item>
            </v-list>
        </v-navigation-drawer>-->
	<div class="header">
		<header>
			<h1>Research Tracer</h1>
			<Navbar />
		</header>
	</div>
</template>
<script>
	import HeaderNav from "@/components/Navbar.vue";

	export default {
		components: {
			HeaderNav
		}
	};

	const items = [
    {
        title: 'item1',
        path: '/link01',
        icon: 'mdi-numeric-1'
    },
    {
        title: 'item2',
        path: '/link02',
        icon: 'mdi-numeric-2'
    }]
</script>
<style lang="scss" scoped>
header {
	color: #fff;
	padding: 20px;
	background-color: #527b8e;
}
</style>