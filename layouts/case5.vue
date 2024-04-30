<template>
    <div class="flex-col">
        <header class="header">
            <h1>Case5 Low-Code System demo</h1>
        </header>
        <div class="flex">
            <FeaturesCase5SideMenu class="side-menu" />
            <main class="contents">
                <slot />
            </main>
        </div>
        <footer />
    </div>
</template>

<style scoped>
.flex-col {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.flex {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
}

.header {
    background-color: hsla(185, 100%, 71%, 0.15);
    border-bottom: 2px solid rgb(165, 165, 165);
    color: rgb(80, 80, 80);
}

.side-menu {
    width: 13%;
}

.contents {
    width: 87%;
}

h1 {
    margin-left: 20px;
}
</style>