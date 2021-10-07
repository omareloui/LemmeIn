<template>
  <container padding-bottom no-heading>
    Homepage
    <pre>safe: {{ $accessor.analyze.safe }}</pre>
    <pre>okay: {{ $accessor.analyze.okay }}</pre>
    <pre>weak: {{ $accessor.analyze.weak }}</pre>
    <pre>compromised: {{ $accessor.analyze.compromised }}</pre>
    <pre>outdated: {{ $accessor.analyze.outdated }}</pre>
    <pre>duplicated: {{ $accessor.analyze.duplicated }}</pre>
  </container>
</template>
