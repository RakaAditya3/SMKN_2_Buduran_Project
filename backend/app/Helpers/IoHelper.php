<?php

function array_number($max, $min = 1, $leadingZero = false, $suffix = '')
{
    $result = [];
    for ($i = $min; $i <= $max; $i++) {
        $number = $i;
        if ($leadingZero == true && strlen($number) == 1) $number = '0' . $number;
        $result[$number] = $number . \Illuminate\Support\Str::plural($suffix, $number);
    }
    return $result;
}

function unit_durations()
{
    return [
        'days' => 'Days',
        'weeks' => 'Weeks',
        'months' => 'Months',
        'years' => 'Years',
        'hours' => 'Hours',
    ];
}

function modules()
{
    return ['Club', 'Stadium'];
}

function payment_methods()
{
    return ['Cash', 'Bank Transfer', 'QR Code'];
}

//=========

function ioRouteResource($name, $controller) {
    \Illuminate\Support\Facades\Route::resource($name, $controller);
    \Illuminate\Support\Facades\Route::prefix($name)->name("$name.")->group(function () use ($controller, $name) {
        \Illuminate\Support\Facades\Route::post('/search', [$controller, 'search'])->name('search');
        \Illuminate\Support\Facades\Route::put('/{'. $name . '}/restore', [$controller, 'restore'])->name('restore');
    });
}

function increment_workday($start, $daysToIncrement, array $holidays = [])
{
    $date = \Carbon\Carbon::parse($start);
    $currentDate = $date->copy();
    $incrementedDate = $currentDate->copy();
    while ($daysToIncrement > 0) {
        $incrementedDate->addDay();
        if ($incrementedDate->isWeekend() || in_array($incrementedDate->toDateString(), $holidays)) continue;

        $daysToIncrement--;
    }

    return $incrementedDate->toDateString();
}

function has_route($route, $params = [])
{
    return (\Illuminate\Support\Facades\Route::has($route)) ? route($route, $params) : '#';
}

function paginate_options()
{
    $result = [];
    foreach ([10, 20, 50, 100] as $value) $result[$value] = $value;
    return $result;
}

function gender()
{
    return ['L' => 'Male', 'P' => 'Female'];
}

function religion()
{
    return [
        'Islam' => 'Islam',
        'Katolik' => 'Katolik',
        'Kristen' => 'Kristen',
        'Hindu' => 'Hindu',
        'Budha' => 'Budha',
        'Konghucu' => 'Konghucu',
        'Lainnya' => 'Lainnya',
    ];
}

function str_limit($value, $limit = 60)
{
    return \Illuminate\Support\Str::limit($value, $limit);
}

function str_slug($value, $separator = '-')
{
    return \Illuminate\Support\Str::slug($value, $separator);
}

function str_unslug($value, $separator = '-')
{
    return ucwords(strtolower(str_replace($separator, ' ', $value)));
}

function str_plural($value, $count = 1)
{
    if ($count === 0) $count = 1;
    return \Illuminate\Support\Str::plural($value, $count);
}

function remove_space($value)
{
    return str_replace(' ', '', $value);
}

function serialize_array($data)
{
    return http_build_query($data);
}

function format_number($number, $currency = 'IDR')
{
    return $number ? ($currency == 'IDR' ? number_format($number, 0, ',', '.') : number_format($number, 2, '.', ',')) : '0';
}

function format_akuntansi($number, $currency = 'IDR')
{
    if ($number == "") return "";
    $result = $currency == 'IDR' ?
        number_format($number, 0, ',', '.') :
        number_format($number, 2, '.', ',');
    if ($number < 0) $result ='('. str_replace('-', '', $result) .')';
    return $result;
}

function format_idr($number)
{
    if ($number === null || $number === "") {
        return "-";
    }

    $formatted_number = number_format($number, 2, ',', '.');

    if ($number < 0) {
        $formatted_number = '(' . str_replace('-', '', $formatted_number) . ')';
    }

    return $formatted_number;
}

function format_decimal($number, $decimal = 2)
{
    return $number ? number_format($number, $decimal, ',', '.') : '';
}

function format_decimal2($number)
{
    return $number ? number_format($number, 4, ',', '.') : '';
}

function list_bulan($short = false)
{
    return $short ?
        array('Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des') :
        array('Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember');
}

function list_dates($start_date, $end_date, $format = 'Y-m-d') {
    $dates = [];

    $start = new \DateTime($start_date);
    $end = new \DateTime($end_date);
    $end->modify('+1 day');
    $interval = new \DateInterval('P1D');
    $period = new \DatePeriod($start, $interval, $end);
    foreach ($period as $date) $dates[] = $date->format($format);

    return $dates;
}

function list_hours($start_time, $end_time, $format = 'H:i:s') {
    $hours = [];

    $start = new \DateTime($start_time);
    $end = new \DateTime($end_time);
    $end->modify('+1 hour'); // include the end time
    $interval = new \DateInterval('PT1H'); // 1 hour interval
    $period = new \DatePeriod($start, $interval, $end);

    foreach ($period as $time) {
        $hours[] = $time->format($format);
    }

    return $hours;
}



function list_hari()
{
    return array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
}

function fulldate($date, $divider = "", $shortMonth = false)
{
    if ($date == "") return "";

    $dayText = list_hari();
    $monthText = list_bulan($shortMonth);

    $dayInt = date('N', strtotime($date));
    $date = explode("-", date('Y-m-d', strtotime($date)));
    $monthInt = (int)$date[1];

    $result = [];
    if ($divider !== "") {
        $result[] = $dayText[$dayInt - 1] . ', ';
    }
    $result[] = $date[2];
    $result[] = ' ';
    $result[] = $monthText[$monthInt - 1];
    $result[] = ' ';
    $result[] = $date[0];

    return implode($divider, $result);
}


function format_date($date, $divider = "-")
{
    return $date ? implode($divider, array_reverse(explode("-", date('Y-m-d', strtotime($date))))) : '';
}

function format_time($time, $short = true)
{
    return $time ? ($short ? date('H:i', strtotime($time)) : date('H:i:s', strtotime($time))) : '';
}

function number_to_alphabeth($number)
{
    return chr(64 + $number);
}

function number_to_roman($number)
{
    $map = [
        'M' => 1000, 'CM' => 900,
        'D' => 500, 'CD' => 400,
        'C' => 100, 'XC' => 90,
        'L' => 50, 'XL' => 40,
        'X' => 10, 'IX' => 9,
        'V' => 5, 'IV' => 4,
        'I' => 1,
    ];

    $result = '';
    foreach ($map as $roman => $int) {
        while ($number >= $int) {
            $result .= $roman;
            $number -= $int;
        }
    }
    return $result;
}


function roman_to_number($roman)
{
    $romans = [
        'M' => 1000, 'CM' => 900,
        'D' => 500, 'CD' => 400,
        'C' => 100, 'XC' => 90,
        'L' => 50, 'XL' => 40,
        'X' => 10, 'IX' => 9,
        'V' => 5, 'IV' => 4,
        'I' => 1,
    ];

    $result = 0;
    foreach ($romans as $key => $value) {
        while (strpos($roman, $key) === 0) {
            $result += $value;
            $roman = substr($roman, strlen($key));
        }
    }
    return $result;
}


function spell_number_core($nilai) {
    $huruf = array("", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas");
    if ($nilai < 12) return $huruf[$nilai];
    elseif ($nilai < 20) return spell_number_core($nilai - 10) . " belas";
    elseif ($nilai < 100) return spell_number_core($nilai / 10) . " puluh " . spell_number_core($nilai % 10);
    elseif ($nilai < 1000) return spell_number_core($nilai / 100) . " ratus " . spell_number_core($nilai % 100);
    elseif ($nilai < 1000000) return spell_number_core($nilai / 1000) . " ribu " . spell_number_core($nilai % 1000);
    elseif ($nilai < 1000000000) return spell_number_core($nilai / 1000000) . " juta " . spell_number_core($nilai % 1000000);
    elseif ($nilai < 1000000000000) return spell_number_core($nilai / 1000000000) . " milyar " . spell_number_core(fmod($nilai, 1000000000));
    elseif ($nilai < 1000000000000000) return spell_number_core($nilai / 1000000000000) . " trilyun " . spell_number_core(fmod($nilai, 1000000000000));
    return "";
}

function spell_number($number) {
    if ($number == '') return "";
    if ($number == 0) return "nol";
    elseif ($number < 0) return "minus " . spell_number_core(abs($number));
    else return trim(spell_number_core($number));
}

function date_difference($date1, $date2)
{
    return (new DateTime($date2))->diff(new DateTime($date1))->days + 1;
}

function unformat_date($date)
{
    return $date ? date('Y-m-d', strtotime($date)) : null;
}

function unformat_number($number)
{
    if ($number == '') return $number;
    $number = str_replace('.', '', $number);
    $number = str_replace(',', '.', $number);
    return $number;
}
