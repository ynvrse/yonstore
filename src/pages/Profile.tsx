import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Profile() {
    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Profile Page</PageHeaderHeading>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description.</CardDescription>
                </CardHeader>
            </Card>
        </>
    );
}
