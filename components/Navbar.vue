<template>
	<div>
		<nav>
			<ul>
				<li>
					<nuxt-link to="/">index</nuxt-link>
				</li>
				<li>
					<nuxt-link to="/link01">link 1</nuxt-link>
				</li>
				<li>
					<nuxt-link to="/link02">Map Search</nuxt-link>
				</li>
			</ul>
		</nav>
	</div>
</template>
<script>
	export default {
		components: {}
	};
</script>
<style lang="scss" scoped>
nav {
	color: #040404;
	ul {
		display: flex;
		justify-content: flex-end;
		li {
			list-style-type: none;
			margin-left: 15px;
			a {
				color: #060606;
			}
		}
	}
}
</style>