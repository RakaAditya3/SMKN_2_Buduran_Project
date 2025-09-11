<?php

namespace App\Services;

class Service
{
    public function searchFilter($params, $model, $filters)
    {
        foreach ($filters as $filter) {
            $value = $params[$filter] ?? '';
            if ($value === 'null') $model = $model->whereNull($filter);
            else if ($value === 'not_null') $model = $model->whereNotNull($filter);
            else if ($value !== '') $model = $model->where($filter, $value);
        }
        return $model;
    }

    public function searchResponse($params, $model)
    {
        $with = $params['with'] ?? '';
        if ($with !== '') $model = $model->with($with);
        $limit = $params['limit'] ?? '';
        if ($limit !== '') $model = $model->limit($limit);
        $skip = $params['skip'] ?? '';
        if ($skip !== '') $model = $model->skip($skip);

        $is_trash = $params['is_trash'] ?? '';
        if ($is_trash !== '') $model = $model->onlyTrashed();

        $orders = $params['orders'] ?? '';
        if ($orders !== '') {
            foreach ($orders as $column => $direction) $model = $model->orderBy($column, $direction);
        }

        $count = $params['count'] ?? '';
        if ($count !== '') return $model->count();
        $sum = $params['sum'] ?? '';
        if ($sum !== '') return $model->sum($sum);
        $first = $params['first'] ?? '';
        if ($first !== '') return $model->first();
        $paginate = $params['paginate'] ?? '';
        if ($paginate !== '') return $model->paginate($paginate);

        return $model->get();
    }

    public function cleanNumber($params, $columns = [])
    {
        foreach ($columns as $column) if (!empty($params[$column])) $params[$column] = intval(unformat_number($params[$column]));
        return $params;
    }

    public function cleanDate($params, $columns = [])
    {
        foreach ($columns as $column) if (!empty($params[$column])) $params[$column] = unformat_date($params[$column]);
        return $params;
    }

    public function curlRequest($url, $method, $fields = '', $header = [])
    {
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_POSTFIELDS => $fields,
            CURLOPT_HTTPHEADER => $header,
        ));

        $response = curl_exec($curl);
        $response = json_decode($response, true);

        if (curl_errno($curl)) {
            $error_msg = curl_error($curl);
            dd($error_msg);
        }

        curl_close($curl);
        return $response;
    }

    
    
}
