const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export class Utils {
    static months(config: { count?: number; section?: number }) {
        const cfg = config || {};
        const count = cfg.count || 12;
        const section = cfg.section;
        const values = [];
        let i, value;

        for (i = 0; i < count; ++i) {
            value = MONTHS[Math.ceil(i) % 12];
            values.push(value.substring(0, section));
        }

        return values;
    }

    static loadPatternsHTML(srcs: string[]): Promise<HTMLImageElement[]> {
        return Promise.all(
            srcs.map((src) => {
                return new Promise<HTMLImageElement>((resolve) => {
                    console.info('loading pattern from', src);
                    const img = new Image();
                    img.src = src;
                    img.onload = () => {
                        resolve(img);
                    };
                });
            })
        );
    }

    static loadPatterns(srcs: string[]) {
        return Promise.all(
            srcs.map((src) => {
                return new Promise((resolve) => {
                    console.info('loading pattern from', src);
                    const img = new Image();
                    img.src = src;
                    img.onload = () => {
                        const canvasElement = document.createElement('canvas');

                        if (!canvasElement) {
                            console.info('"canvas" element not found');
                            resolve(null);
                            return;
                        }

                        const ctx = canvasElement.getContext('2d');

                        if (!ctx) {
                            console.info('"canvas" getContext error');
                            resolve(null);
                            return;
                        }

                        const fillPattern = ctx.createPattern(img, 'repeat');
                        resolve(fillPattern);
                        console.info('pattern loaded');
                    };
                });
            })
        );
    }
}
