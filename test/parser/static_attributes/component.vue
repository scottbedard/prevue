<!--
    only the "one" and "three" attrs should be part of staticAttrs.
    "v-bind:foo" and ":bar" should be ignored because they are not static.
-->

<template>
    <div 
        v-bind:foo="1" 
        :bar="2"
        one="two" 
        three="four" 
    ></div>
</template>