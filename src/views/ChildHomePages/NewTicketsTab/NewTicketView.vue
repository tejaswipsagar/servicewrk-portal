<template>
  <div>
    <router-view />
  </div>
</template>
<script>
export default {
  data: () => ({
    ticketBtns: [
      {
        name: "Active",
        path: "/ActiveTickets",
      },
      {
        name: "Partially Closed",
        path: "/PartiallyClosedTickets",
      },
      {
        name: "Closed",
        path: "/ClosedTickets",
      },
      {
        name: "Inactive",
        path: "/InactiveTickets",
      },
    ],
  }),
};
</script>
