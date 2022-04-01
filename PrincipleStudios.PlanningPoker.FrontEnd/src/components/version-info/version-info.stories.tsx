import { ComponentStory, ComponentMeta } from '@storybook/react';
import { VersionInfo } from './version-info';

export default {
	title: 'Components/VersionInfo',
	component: VersionInfo,
} as ComponentMeta<typeof VersionInfo>;

const Template: ComponentStory<typeof VersionInfo> = (args) => (
    <VersionInfo {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
    gitHash: 'storybook-githash'
};
