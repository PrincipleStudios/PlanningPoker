import { ComponentMeta, ComponentStory } from '@storybook/react';
import HomePage from './home';

export default {
	title: 'Pages/Home',
	component: HomePage,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<main className="bg-black h-screen">
				<Story />
			</main>
		),
	],
} as ComponentMeta<typeof HomePage>;

const Template: ComponentStory<typeof HomePage> = () => <HomePage />;

export const BaseComponent = Template.bind({});
BaseComponent.storyName = 'Home';
