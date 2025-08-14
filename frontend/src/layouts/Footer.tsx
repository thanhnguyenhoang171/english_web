import { Footer } from 'antd/es/layout/layout';

export function AppFooter() {
    return (
        <Footer style={{ textAlign: 'center' }}>
            Fullstack Developer ©{new Date().getFullYear()} Created by Thane
            Nguyen
        </Footer>
    );
}
