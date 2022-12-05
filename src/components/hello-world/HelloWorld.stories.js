import HelloWorld from "./HelloWorld.vue";

export default {
  title: "Example/HelloWorld",
  component: HelloWorld,
  argTypes: {
    name: {},
  },
};

const Template = (args) => ({
  components: { HelloWorld },
  setup: () => ({ ...args }),
  template: `<hello-world :name="name"/>`,
});

export const Default = Template.bind({});
Default.args = {
  name: "world",
};
