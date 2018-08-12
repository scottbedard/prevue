<!--
    only the "one" and "three" attrs should be part of staticAttrs.
    "v-foo" and ":hello" should be ignored because they are not static.
-->

<template>
    <div 
        v-foo="bar" 
        :hello="world"
        one="two" 
        three="four" 
    ></div>
</template>