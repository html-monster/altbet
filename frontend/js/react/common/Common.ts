/**
 * Common functions
 *
 * Created by Vlasakh on 22.12.2016.
 */

export class Common
{
        public static toFixed(value, precision) {
            return (Math.round(value * 100) / 100).toFixed(precision);
        }
}